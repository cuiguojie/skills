---
name: book-to-skill
description: Convert a book, essay, framework, or expert worldview into an executable agent skill package. Use when the user wants to turn source cognition into a reusable operating paradigm, not just a summary.
---

# Book To Skill

Use this skill to turn source material into a skill package that an agent can execute.

Do not write a book report. Produce an operating system for action. Use a thin root `SKILL.md` by default, and add supporting `references/` or `scripts/` only when they materially improve execution.

## Required Reading

Before drafting the target skill, read these files in this skill directory:

- `references/language.md`: shared vocabulary for cognition-to-skill conversion.
- `references/transformation.md`: how to extract an operating paradigm from source material.
- `references/skill-packaging.md`: how to package the paradigm into the skill ecosystem.
- `references/quality-gates.md`: checks that reject weak or over-abstract skills.

## Workflow

1. Identify the target task the generated skill must perform.
2. Read or inspect the supplied source material, notes, excerpts, links, or user explanation.
3. Use `references/transformation.md` to extract worldview, quality criteria, operating objects, inspection questions, decision rules, deliverables, and feedback signals.
4. Use `references/skill-packaging.md` to design the file structure from the source material, target task, and execution risks.
5. Draft the skill package with clear triggers, required reading order, execution workflow, deliverables, and validation checks.
6. Apply `references/quality-gates.md`; revise until the result is specific, executable, and not merely descriptive.

## File Organization Rule

Keep the generated `SKILL.md` focused on routing attention and executing the workflow.

Move supporting material into `references/` files when any of these are true:

- The skill needs a controlled vocabulary.
- The source worldview has many concepts or distinctions.
- The workflow depends on reusable transformation rules.
- The main skill file starts explaining theory instead of directing action.

Possible package:

```text
target-skill/
  SKILL.md
  references/
    language.md      # optional: when terms constrain execution
    rules.md         # optional: when stable rules need separation
    quality-gates.md # optional: when validation is non-trivial
  scripts/
    helper.mjs       # optional: when executable helpers are needed
```

Use fewer files for small skills. Split files to preserve attention, not to create ceremony. A generated skill may have no supporting references, one terminology reference, multiple domain references, scripts, or a different structure. The structure should follow the source's operational needs while keeping root-level support files out of the skill root.

## Output Requirements

When creating or revising a skill package, deliver:

- The path to the generated or updated skill files.
- A short explanation of the worldview operationalized.
- The chosen file structure and why it is that shape.
- Any uncertainty caused by incomplete source material.
- One concrete way to test the skill on real work.

## Constraints

- Do not fabricate detailed source claims when source material is incomplete.
- Do not let the source's original chapter structure dictate the skill structure.
- Do not include long quotations from copyrighted material.
- Do not create universal advice that could apply to any source.
- Do not make the main `SKILL.md` a theory document.
