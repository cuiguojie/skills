# Language

Use these terms consistently when converting source cognition into a skill package.

## Source Cognition

The ideas, distinctions, judgments, and practices found in a book, essay, course, talk, interview, or expert notes.

Do not treat source cognition as content to summarize. Treat it as raw material for an operating paradigm.

## Worldview

The source's underlying claims about how a domain works.

Worldview answers:

- What is the central problem?
- What matters most?
- What does the source optimize for?
- What does it warn against?
- What does it consider excellent work?

Worldview should be short. If it becomes a chapter summary, it is no longer a worldview.

## Quality Criteria

Observable signals that distinguish good from bad under the worldview.

Quality criteria should let an agent inspect real material and say:

- This is strong because evidence X is present.
- This is weak because symptom Y is present.
- This is uncertain because signal Z is missing.

Avoid words like "clear", "robust", "strategic", or "elegant" unless the skill defines how to observe them.

## Operating Object

An object the agent can identify, inspect, compare, modify, or produce.

Examples:

- Software: module, interface, dependency, seam, adapter, test surface.
- Writing: thesis, claim, evidence, paragraph role, reader promise.
- Product: user job, wedge, activation event, risk assumption, feedback loop.
- Management: decision owner, operating cadence, escalation path, accountability boundary.

Operating objects are the bridge between cognition and action. If an idea does not produce an operating object, it may belong in background material, not the skill workflow.

## Signature Practice

A distinctive practice, heuristic, exercise, test, or named move from the source that changes how work is done.

Signature practices are more specific than worldview claims. They often appear as:

- A named exercise.
- A recurring diagnostic test.
- A recommended comparison method.
- A concrete workflow the author advocates.
- A non-obvious rule that differentiates the source from generic domain advice.

Do not omit signature practices just because the worldview is already captured. These are often what make the resulting skill source-specific rather than merely sensible.

## Inspection Question

A question the agent asks of real material before deciding.

Good inspection questions force contact with evidence:

- Which files own this behavior?
- What breaks if this layer is removed?
- Which claim lacks evidence?
- What user-visible behavior proves this works?

Weak inspection questions are introspective or generic:

- Is this good?
- Can this be improved?
- Is this aligned with the philosophy?

## Decision Rule

An if-then rule that converts an observed condition into action.

Format:

```text
If <observable condition>, then <action>, because <source principle>.
```

Decision rules are the core of an executable skill. Without them, the skill is a vocabulary list.

## Deliverable

The artifact the skill produces.

Examples:

- `SKILL.md` package.
- Architecture review.
- ADR.
- Refactor plan.
- Editorial rewrite.
- Product brief.
- Checklist.

Deliverables constrain the skill's end state and prevent endless analysis.

## Feedback Signal

Evidence that the skill's output improved the target work.

Examples:

- Fewer call sites change for a future feature.
- Tests use public interfaces instead of internals.
- A plan has measurable assumptions.
- A document has fewer unsupported claims.

Feedback signals can be immediate checks or future validation hooks.

## Skill Package

A folder containing `SKILL.md` and optional supporting files.

The package should organize attention:

- `SKILL.md`: trigger, required reading, workflow, deliverables.
- Terminology reference, such as `references/language.md` or `references/terms.md`: controlled vocabulary when terms affect execution.
- Rule or topic references, such as `references/rules.md` or `references/<domain>-rules.md`: stable rules and conceptual distinctions when they need separation.
- Quality reference, such as `references/quality-gates.md` or `references/validation.md`: validation checks when pass/fail behavior is non-trivial.

Do not split files for aesthetics. Split files when it improves execution.
