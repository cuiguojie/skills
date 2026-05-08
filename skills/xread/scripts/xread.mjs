#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

/*
 * xread is still intentionally a single-file skill script, but it is organized
 * like a small CLI project so later extraction is a mechanical refactor rather
 * than a redesign.
 *
 * Logical layers in this file:
 * 1. CLI shell: help text, arg parsing, main()
 * 2. Mirror adapter: fetch payload, normalize mirror-specific shapes
 * 3. Article renderer: block-based longform payloads
 * 4. Tweet renderer: note tweets / plain tweets with facet-based inline styles
 * 5. Output sink: stdout plus optional file write
 *
 * If this grows into a standalone CLI, those layers can split into dedicated
 * modules without changing the rendering contract.
 */

// The default mirror endpoint is backed by the FxEmbed project:
// https://github.com/FxEmbed/FxEmbed
// If this skill is later extracted into a standalone CLI, MIRROR_BASE_URL is the
// intended override point for switching to a self-hosted deployment.
const MIRROR_BASE_URL = "https://api.fxtwitter.com";
const USER_AGENT = "xread/0.1";
const HELP_TEXT = [
  "xread",
  "",
  "Read an X/Twitter status URL or numeric id and render it as faithful Markdown.",
  "",
  "Usage:",
  "  node scripts/xread.mjs <url-or-id>",
  "  node scripts/xread.mjs <url-or-id> -o /tmp/post.md",
  "",
  "Behavior:",
  "  - prints Markdown to stdout",
  "  - with -o/--output, also saves a copy to a file",
  "  - preserves headings, lists, blockquotes, images, markdown snippets, and embedded tweet placeholders",
  "  - keeps suspicious link entities as plain text rather than guessing repairs",
  "",
].join("\n");

// -----------------------------------------------------------------------------
// CLI shell
// -----------------------------------------------------------------------------

function printHelp() {
  process.stdout.write(HELP_TEXT);
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = [...argv];
  let outputPath = null;
  let input = null;

  while (args.length > 0) {
    const token = args.shift();
    if (token === "-h" || token === "--help") {
      printHelp();
      process.exit(0);
    }
    if (token === "-o" || token === "--output") {
      const next = args.shift();
      if (!next) {
        fail("missing path after -o/--output");
      }
      outputPath = next;
      continue;
    }
    if (token.startsWith("-")) {
      fail(`unknown option: ${token}`);
    }
    if (input) {
      fail("expected a single url-or-id input");
    }
    input = token;
  }

  if (!input) {
    printHelp();
    process.exit(1);
  }

  return { input, outputPath };
}

function extractStatusId(input) {
  if (/^\d+$/.test(input)) {
    return input;
  }

  const match = input.match(/(?:twitter|x)\.com\/(?:i\/web\/)?[^/]*\/?status\/(\d+)/i);
  if (match) {
    return match[1];
  }

  fail("unsupported input; expected an x.com status URL or numeric status id");
}

// -----------------------------------------------------------------------------
// Mirror adapter
// -----------------------------------------------------------------------------

async function fetchPayload(statusId) {
  const url = `${MIRROR_BASE_URL}/status/${statusId}`;
  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    fail(`mirror request failed with HTTP ${response.status}`);
  }

  const payload = await response.json();
  if (!payload?.tweet) {
    fail("mirror response did not contain a tweet payload");
  }
  return payload.tweet;
}

function normalizeEntityMap(entityMap) {
  // The mirror uses an array of { key, value } pairs for article content,
  // while other sources may expose a plain object map.
  if (!entityMap) {
    return new Map();
  }
  if (Array.isArray(entityMap)) {
    return new Map(entityMap.map((item) => [String(item.key), item.value]));
  }
  return new Map(Object.entries(entityMap).map(([key, value]) => [String(key), value]));
}

function isExactUrl(value) {
  return /^https?:\/\/[A-Za-z0-9._~:/?#\[\]@!$&'()*+,;=%-]+$/.test(value);
}

/*
 * Article payloads express formatting through block structure plus inline ranges.
 * We render them by building a pair of "open" / "close" markers over the source
 * text, which keeps the output deterministic and avoids semantic rewriting.
 */
function renderInline(text, entityRanges, styleRanges, entityMap) {
  const opens = new Map();
  const closes = new Map();

  const addOpen = (position, marker) => {
    const bucket = opens.get(position) ?? [];
    bucket.push(marker);
    opens.set(position, bucket);
  };

  const addClose = (position, marker) => {
    const bucket = closes.get(position) ?? [];
    bucket.push(marker);
    closes.set(position, bucket);
  };

  for (const range of styleRanges ?? []) {
    if (range.style !== "Bold") {
      continue;
    }
    const start = range.offset;
    const end = range.offset + range.length;
    addOpen(start, "**");
    addClose(end, "**");
  }

  for (const range of entityRanges ?? []) {
    const entity = entityMap.get(String(range.key));
    if (!entity || entity.type !== "LINK") {
      continue;
    }

    const start = range.offset;
    const end = range.offset + range.length;
    const segment = text.slice(start, end);
    const url = entity?.data?.url;

    if (isExactUrl(segment)) {
      addOpen(start, "<");
      addClose(end, ">");
      continue;
    }

    // Mirror payloads occasionally attach malformed URLs to valid anchor text.
    // Only emit Markdown links when the visible text is not itself a URL and the
    // target URL is syntactically safe.
    if (!segment.startsWith("http://") && !segment.startsWith("https://") && isExactUrl(url ?? "")) {
      addOpen(start, "[");
      addClose(end, `](${url})`);
    }
  }

  const result = [];
  for (let index = 0; index <= text.length; index += 1) {
    const closing = closes.get(index);
    if (closing) {
      for (const marker of [...closing].reverse()) {
        result.push(marker);
      }
    }
    const opening = opens.get(index);
    if (opening) {
      for (const marker of opening) {
        result.push(marker);
      }
    }
    if (index < text.length) {
      result.push(text[index]);
    }
  }

  return result.join("").replaceAll("\n", "  \n");
}

function createMediaLookup(mediaEntities = []) {
  const lookup = new Map();
  for (const media of mediaEntities) {
    const url = media?.media_info?.original_img_url;
    const mediaId = media?.media_id;
    if (url && mediaId) {
      lookup.set(String(mediaId), url);
    }
  }
  return lookup;
}

function createSimpleMediaList(mediaEntities = []) {
  const urls = [];
  for (const media of mediaEntities) {
    // Plain tweets/note tweets expose direct media URLs, unlike article payloads
    // which require media_id -> media_info lookup.
    const url = media?.url;
    if (url) {
      urls.push(url);
    }
  }
  return urls;
}

function renderAtomic(block, entityMap, mediaLookup) {
  const firstRange = block.entityRanges?.[0];
  if (!firstRange) {
    return null;
  }

  const entity = entityMap.get(String(firstRange.key));
  if (!entity) {
    return null;
  }

  if (entity.type === "TWEET") {
    // Embedded tweets inside article blocks are part of the article body, so they
    // get a visible placeholder instead of being silently dropped.
    const tweetId = entity?.data?.tweetId;
    return tweetId ? `> Embedded tweet: <https://x.com/i/web/status/${tweetId}>` : "> Embedded tweet";
  }

  if (entity.type === "MEDIA") {
    const mediaId = entity?.data?.mediaItems?.[0]?.mediaId;
    const url = mediaId ? mediaLookup.get(String(mediaId)) : null;
    return url ? `![配图](${url})` : null;
  }

  if (entity.type === "MARKDOWN") {
    // Some article builders serialize richer inserts, including fenced code
    // blocks, as standalone MARKDOWN entities inside atomic blocks. Returning
    // the markdown payload directly preserves those structures without trying
    // to reinterpret them as plain text.
    const markdown = entity?.data?.markdown;
    return typeof markdown === "string" && markdown.trim() ? markdown.trim() : null;
  }

  return null;
}

// -----------------------------------------------------------------------------
// Markdown assembly
// -----------------------------------------------------------------------------

class MarkdownBuilder {
  constructor() {
    this.lines = [];
    this.previousType = null;
  }

  addBlankLine() {
    if (this.lines.length === 0) {
      return;
    }
    if (this.lines[this.lines.length - 1] !== "") {
      this.lines.push("");
    }
  }

  addBlock(text, type, { joinWithPrevious = false } = {}) {
    if (!joinWithPrevious) {
      this.addBlankLine();
    }
    this.lines.push(text);
    this.previousType = type;
  }

  toString() {
    return `${this.lines.join("\n").trim()}\n`;
  }
}

// -----------------------------------------------------------------------------
// Article renderer
// -----------------------------------------------------------------------------

function renderArticle(article) {
  const builder = new MarkdownBuilder();
  const content = article?.content ?? {};
  const blocks = content.blocks ?? [];
  const entityMap = normalizeEntityMap(content.entityMap);
  const mediaLookup = createMediaLookup(article.media_entities);

  // Article payloads already encode headings, lists, blockquotes, and inline
  // media explicitly, so this path stays as close to that structure as possible.
  builder.addBlock(`# ${article.title ?? "Untitled"}`, "heading", { joinWithPrevious: true });

  const coverUrl = article?.cover_media?.media_info?.original_img_url;
  if (coverUrl) {
    builder.addBlock(`![封面图](${coverUrl})`, "cover");
  }

  let orderedIndex = 0;

  for (const block of blocks) {
    // Unknown article block types are ignored on purpose. The fallback policy is
    // "drop uncertain structure rather than invent Markdown that was not present".
    const type = block.type;
    const text = renderInline(
      block.text ?? "",
      block.entityRanges ?? [],
      block.inlineStyleRanges ?? [],
      entityMap,
    );

    if (type !== "ordered-list-item") {
      orderedIndex = 0;
    }

    if (type === "unstyled") {
      if (text.trim()) {
        builder.addBlock(text, type);
      }
      continue;
    }

    if (type === "header-two") {
      if (text.trim()) {
        builder.addBlock(`## ${text}`, type);
      }
      continue;
    }

    if (type === "blockquote") {
      const quoted = text
        .split("  \n")
        .map((line) => `> ${line}`)
        .join("\n");
      builder.addBlock(quoted, type);
      continue;
    }

    if (type === "unordered-list-item") {
      builder.addBlock(`- ${text}`, type, {
        joinWithPrevious: builder.previousType === "unordered-list-item",
      });
      continue;
    }

    if (type === "ordered-list-item") {
      orderedIndex += 1;
      builder.addBlock(`${orderedIndex}. ${text}`, type, {
        joinWithPrevious: builder.previousType === "ordered-list-item",
      });
      continue;
    }

    if (type === "atomic") {
      const rendered = renderAtomic(block, entityMap, mediaLookup);
      if (rendered) {
        builder.addBlock(rendered, type);
      }
    }
  }

  return builder.toString();
}

// -----------------------------------------------------------------------------
// Note / plain tweet renderer
// -----------------------------------------------------------------------------

function renderFacetText(rawText, facets = [], displayTextRange = []) {
  // Note tweets store inline formatting as text facets. Respect display_text_range
  // so hidden media suffixes do not leak into the rendered body.
  const displayStart = Number.isInteger(displayTextRange[0]) ? displayTextRange[0] : 0;
  const displayEnd = Number.isInteger(displayTextRange[1]) ? displayTextRange[1] : rawText.length;
  const text = rawText.slice(displayStart, displayEnd);

  const opens = new Map();
  const closes = new Map();
  const replacements = new Map();

  const addOpen = (position, marker) => {
    const bucket = opens.get(position) ?? [];
    bucket.push(marker);
    opens.set(position, bucket);
  };

  const addClose = (position, marker) => {
    const bucket = closes.get(position) ?? [];
    bucket.push(marker);
    closes.set(position, bucket);
  };

  for (const facet of facets) {
    const [rawStart, rawEnd] = facet.indices ?? [];
    if (!Number.isInteger(rawStart) || !Number.isInteger(rawEnd)) {
      continue;
    }
    if (rawStart < displayStart || rawEnd > displayEnd) {
      continue;
    }

    const start = rawStart - displayStart;
    const end = rawEnd - displayStart;
    const segment = text.slice(start, end);

    if (facet.type === "bold") {
      addOpen(start, "**");
      addClose(end, "**");
      continue;
    }

    if (facet.type === "url") {
      const replacement = facet.replacement;
      const display = facet.display;

      if (!isExactUrl(segment) || !isExactUrl(replacement ?? "")) {
        continue;
      }

      if (display && display !== segment && display !== replacement) {
        replacements.set(start, {
          end,
          text: `[${display}](${replacement})`,
        });
        continue;
      }

      replacements.set(start, {
        end,
        text: `<${replacement}>`,
      });
    }

    // Media facets exist in note tweets too, but their offsets are not reliable
    // enough to place inline. Media is rendered from tweet.media.all as an
    // attachment area after the body, which better matches X's visual layout.
  }

  const result = [];
  for (let index = 0; index <= text.length; index += 1) {
    const replacement = replacements.get(index);
    if (replacement) {
      result.push(replacement.text);
      index = replacement.end - 1;
      continue;
    }

    const closing = closes.get(index);
    if (closing) {
      for (const marker of [...closing].reverse()) {
        result.push(marker);
      }
    }

    const opening = opens.get(index);
    if (opening) {
      for (const marker of opening) {
        result.push(marker);
      }
    }

    if (index < text.length) {
      result.push(text[index]);
    }
  }

  return result.join("");
}

function renderNoteOrSimpleTweet(tweet) {
  const rawText = tweet?.raw_text?.text || tweet?.text || "";
  const facets = tweet?.raw_text?.facets ?? [];
  const displayTextRange = tweet?.raw_text?.display_text_range ?? [];
  const body = renderFacetText(rawText, facets, displayTextRange).trim();
  const mediaUrls = createSimpleMediaList(tweet?.media?.all ?? []);
  const lines = [];

  // Plain tweets and note tweets do not expose article-style block structure.
  // Keep the body as text plus a simple attachment area.
  if (body) {
    lines.push(body);
  }

  for (const url of mediaUrls) {
    if (lines.length > 0) {
      lines.push("");
    }
    lines.push(`![配图](${url})`);
  }

  return `${lines.join("\n").trim()}\n`;
}

function renderTweet(tweet) {
  // Branch by payload capability, not by UI naming. X surface types change more
  // often than the underlying data shapes exposed by the mirror.
  if (tweet.article) {
    return renderArticle(tweet.article);
  }
  // Quote/reply context is intentionally omitted here: xread focuses on the
  // current post's own body unless a later mode opts into surrounding context.
  return renderNoteOrSimpleTweet(tweet);
}

// -----------------------------------------------------------------------------
// Output sink + program entry
// -----------------------------------------------------------------------------

async function writeOutput(filePath, markdown) {
  const absolutePath = path.resolve(filePath);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, markdown, "utf8");
}

async function main() {
  // End-to-end flow is intentionally linear:
  // parse input -> resolve status id -> fetch payload -> render markdown -> emit.
  // Keeping this orchestration shallow makes later CLI extraction straightforward.
  const { input, outputPath } = parseArgs(process.argv.slice(2));
  const statusId = extractStatusId(input);
  const tweet = await fetchPayload(statusId);
  const markdown = renderTweet(tweet);

  if (outputPath) {
    await writeOutput(outputPath, markdown);
  }

  process.stdout.write(markdown);
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
