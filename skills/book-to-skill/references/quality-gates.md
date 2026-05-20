# Quality Gates

Use these checks before delivering a generated skill package.

## Gate 1: It Is Not A Summary

Reject if:

- The structure follows book chapters.
- The output mainly lists concepts.
- The skill spends more space explaining the source than directing action.
- There are no decision rules.

Passes if:

- The skill changes what the agent inspects, decides, and produces.
- Source ideas are reorganized around execution.

## Gate 2: It Has A Concrete Task Boundary

Reject if the trigger is:

- "Use this to think better."
- "Use this to apply the book."
- "Use this for any complex problem."

Passes if the trigger names:

- The work surface.
- The agent action.
- The source worldview or method.

Example:

```text
Use when reviewing frontend architecture through the lens of deep modules and complexity reduction.
```

## Gate 3: It Defines Operating Objects

Reject if:

- The skill uses abstract nouns without inspectable objects.
- The agent has no named units to look for in real material.

Passes if:

- Each important concept maps to an object the agent can inspect or modify.
- Operating vocabulary, if needed, constrains observation and conversation.

## Gate 4: It Contains Decision Rules

Reject if:

- The skill only asks questions.
- The skill only says to "consider" or "reflect".
- Recommendations depend entirely on taste.

Passes if:

- It has if-then rules tied to observable conditions.
- Rules include the reason from the source worldview.

## Gate 5: It Captures Signature Practices

Reject if:

- The skill only captures broad domain wisdom that many sources would share.
- The source has distinctive practices, tests, or workflows that are absent from the generated skill.
- A signature practice is mentioned as theory but not converted into a workflow step, rule, optional mode, or quality gate.

Passes if:

- Source-specific practices are identified where source material supports them.
- Heavy or situational practices are packaged as optional modes rather than forced into every run.
- Unverified practices are marked as inferred or omitted pending source evidence.

## Gate 6: It Designs The Skill Package Deliberately

Reject if:

- `SKILL.md` is bloated with theory.
- Supporting files exist but are not referenced by the workflow.
- A terminology or reference file is created even though it does not change execution.

Passes if:

- `SKILL.md` is the entrypoint.
- Supporting files, if any, each solve a concrete execution risk.
- The file structure is explained by the source and task, not by a universal template.

## Gate 7: It Can Fail

Reject if:

- Every output would appear acceptable.
- The skill lacks evidence requirements.
- The skill cannot say "insufficient information".

Passes if:

- It defines uncertainty.
- It states when source material is insufficient.
- It specifies validation checks.

## Gate 8: It Is Source-Specific But Not Source-Bound

Reject if:

- It could apply to any book after replacing the title.
- It preserves source structure too literally.
- It copies source jargon without operational value.

Passes if:

- It captures the source's distinctive way of seeing.
- It reorganizes that cognition into a reusable workflow.

## Gate 9: It Produces Artifacts

Reject if:

- The final answer is only advice.
- The workflow has no concrete output.

Passes if:

- Deliverables are named.
- The expected form of output is clear.
- The user can apply or evaluate the artifact.

## Final Review Checklist

Before final response, confirm:

- The package has a clear file structure.
- `SKILL.md` is focused on execution.
- Required reading order is explicit.
- Terminology is defined only where it affects execution.
- Decision rules are present.
- Signature practices are captured or explicitly scoped out.
- Anti-patterns are addressed.
- Validation gates are included.
- The package structure follows the target source, task, and execution risks.
