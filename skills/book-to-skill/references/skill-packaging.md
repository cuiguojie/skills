# Skill Packaging

Use this guide to package an operating paradigm into the skill ecosystem.

Derive the package structure from the current source material, target task, and execution risks.

## Main Rule

`SKILL.md` is a workflow entrypoint, not a theory document.

It should answer:

- When should this skill run?
- What should the agent read first?
- What sequence should the agent follow?
- What should the agent produce?
- What must be checked before final response?

If the file starts teaching the source in depth, split the teaching material into supporting references. If supporting references do not change execution, remove them.

Prefer the standard skill layout:

```text
target-skill/
  SKILL.md
  references/
    <supporting-reference>.md
  scripts/
    <optional-executable>.*
```

Keep `SKILL.md` at the skill root. Put supporting terminology, rules, quality gates, workflows, and conceptual references under `references/`. Put executable helpers under `scripts/`.

## Design The Reference System

Design supporting files around execution pressure, not around a fixed template.

Ask:

- What distinctions must the agent preserve to avoid bad output?
- Which terms must be defined once to prevent semantic drift?
- Which rules are stable enough to deserve reuse?
- Which material is only explanatory and should stay out of the skill package?

There is no required reference set. A skill can have zero references, one terminology reference, multiple domain references, scripts, or another shape if that better supports execution.

## Packaging Levels

### Level 1: Single File Skill

Use when:

- The skill has few concepts.
- The workflow is short.
- The vocabulary is ordinary.
- There are no major counterexamples that need separate treatment.

Structure:

```text
target-skill/
  SKILL.md
```

### Level 2: Skill Plus References

Use when:

- The source has distinctive terminology.
- The agent must maintain consistent distinctions.
- The workflow depends on reusable rules.
- The main file would become long or explanatory.

Structure:

```text
target-skill/
  SKILL.md
  references/
    <terminology-or-rule-reference-if-needed>.md
```

### Level 3: Multi-Reference Skill Package

Use when:

- The generated skill is abstract or easy to misuse without explicit rules.
- The skill may evolve through real cases.
- Anti-patterns are important.

Structure:

```text
target-skill/
  SKILL.md
  references/
    <terminology-reference-if-needed>.md
    <process-reference-if-needed>.md
    <rule-reference-if-needed>.md
    <quality-reference-if-needed>.md
  scripts/
    <optional-executable>.*
```

## File Responsibilities

### `SKILL.md`

Keep it thin.

Include:

- Frontmatter name and trigger description.
- Purpose.
- Required reading order.
- Workflow.
- Deliverables.
- Final validation.

Avoid:

- Long theory explanations.
- Source summaries.
- Terms that are not used in workflow.

### Terminology Reference

Common names:

- `references/language.md`
- `references/terms.md`
- `references/<domain>-language.md`

Use for controlled vocabulary.

Include:

- Term.
- Operational definition.
- How to recognize it.
- Why it matters.
- Common confusion.

Create this only when terminology materially changes what the agent sees and does. Do not create a terminology file for ordinary words.

### Process Reference

Common names:

- `references/transformation.md`
- `references/workflow.md`
- `references/<task>-process.md`

Use when the skill needs a reusable procedure that is too detailed for `SKILL.md`.

### Rule Reference

Common names:

- `references/rules.md`
- `references/rules.md`
- `references/<domain>-rules.md`

Use for stable rules and conceptual distinctions.

Split topic references when one reference becomes too broad:

```text
references/interface-design.md
references/dependencies.md
references/review-rules.md
```

Rule references should contain reusable rules, not one-off examples.

### Quality Reference

Common names:

- `references/quality-gates.md`
- `references/validation.md`
- `references/checks.md`

Use for validation.

Include:

- Checks before final output.
- Anti-patterns.
- Evidence requirements.
- Failure modes.

## Reference Selection Rules

Use this table when deciding what to create:

```text
Need controlled observation units?       -> add terminology reference
Need reusable multi-step transformation? -> add process reference
Need stable if-then rules?               -> add rule reference
Need non-obvious pass/fail checks?       -> add quality reference
Need executable helper code?             -> add script under scripts/
Only one short workflow?                 -> keep single SKILL.md
```

If a reference or script does not answer a concrete execution risk, do not create it.

## Required Reading Design

The main skill should direct the agent's attention.

Use this pattern:

```md
## Required Reading

Before executing, read:

- `<terminology reference>` if the task depends on controlled vocabulary.
- `<rule reference>` if the task depends on reusable rules.
- `<quality reference>` before finalizing if validation is non-trivial.
- `<script>` only when execution needs a helper that should not be retyped manually.
```

Do not ask the agent to read every file if only one is relevant. Required reading is part of the workflow design.

## Naming Rules

Name files by role, not by source chapter. Pick names that explain why the file exists. Use lowercase kebab-case inside `references/` and `scripts/`.

Prefer:

- `references/language.md`
- `references/terms.md`
- `references/transformation.md`
- `references/interface-design.md`
- `references/quality-gates.md`
- `references/validation.md`
- `scripts/scan.mjs`

Avoid:

- `chapter-1.md`
- `notes.md`
- `misc.md`
- `ideas.md`
- root-level support files next to `SKILL.md`

## Packaging Test

After packaging, ask:

- Can the agent start from `SKILL.md` and know exactly what to read?
- Does each supporting reference or script reduce main-file complexity?
- Is every supporting file used by the workflow?
- If terminology is separated, could a future maintainer update terminology without editing workflow?

If not, reorganize.
