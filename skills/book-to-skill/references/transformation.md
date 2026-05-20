# Transformation

Use this process to convert source cognition into an operating paradigm.

## 1. Define The Target Task

Do not start by asking "what is this book about?"

Start by asking:

- What should the generated skill help the agent do?
- What work surface will the agent inspect or modify?
- Who benefits from this skill?
- What output should exist after the skill runs?

Bad targets:

- Understand this book.
- Apply this philosophy.
- Think like this author.

Good targets:

- Review architecture using this design philosophy.
- Convert strategy notes into product bets.
- Rewrite essays using this editorial method.
- Run project retrospectives using this management framework.

## 2. Extract The Worldview

Identify the source's central beliefs, not its table of contents.

Ask:

- What is the enemy?
- What is the preferred unit of analysis?
- What tradeoff does the source repeatedly make?
- What does it consider waste?
- What does it treat as durable truth?

Keep three to seven claims.

## 3. Extract Quality Criteria

Convert taste into observable judgment.

For each worldview claim, ask:

- What would prove this is going well?
- What symptoms show failure?
- What evidence could an agent inspect?
- What would change in the final artifact?

Each quality criterion should support diagnosis or validation.

## 4. Name Operating Objects

Translate concepts into objects the agent can manipulate.

Good operating objects have three properties:

- Recognizable in real material.
- Useful for diagnosis.
- Useful for action.

Reject objects that are only philosophical labels.

Example:

```text
"Simplicity" is too broad.
"Interface surface area" is inspectable.
```

## 5. Create Inspection Questions

Turn quality criteria into questions.

Inspection questions should produce evidence, not reflection.

Pattern:

```text
For each <operating object>, inspect <evidence> to determine <quality criterion>.
```

Example:

```text
For each module, inspect its callers and tests to determine whether it hides complexity or only forwards calls.
```

## 6. Extract Signature Practices

Identify the source's distinctive moves, not just its general principles.

Ask:

- What named practices, exercises, tests, or heuristics does the source recommend?
- Which practices would be lost if this were rewritten as generic domain advice?
- Which practices can become workflow steps, decision rules, quality gates, or optional modes?
- Which practices require source material confirmation instead of memory or inference?

Examples of the shape:

- A design book may contain a specific comparison exercise.
- A writing book may contain a revision pass or sentence test.
- A management book may contain a meeting protocol or decision cadence.
- A product book may contain a validation sequence or prioritization test.

If a practice is source-distinctive but risky or heavy, do not force it into the default workflow. Package it as an optional mode, rule reference, or quality gate.

## 7. Create Decision Rules

Convert inspection results into actions.

Use this format:

```text
If <observable condition>, then <action>, because <worldview claim>.
```

Decision rules should be specific enough that two agents would make similar recommendations from the same evidence.

Weak:

```text
If design is messy, improve it.
```

Strong:

```text
If a module has many public methods but callers use only one sequence, collapse the sequence behind a smaller interface because the module is shallow.
```

## 8. Define Deliverables

Specify what the agent produces.

Deliverables should reflect the target task, not the source material.

Examples:

- For architecture: findings, boundary proposal, refactor plan, test strategy.
- For writing: thesis diagnosis, outline, rewritten draft, claim-evidence table.
- For product: bet map, assumption list, validation plan, launch decision.

## 9. Define Feedback Signals

Make the method falsifiable.

Ask:

- How do we know this helped?
- What would regress if it failed?
- What can be checked immediately?
- What must be checked later?

Use feedback signals in the final skill's validation section.

## 10. Package For Execution

Once the operating paradigm exists, decide file structure using `references/skill-packaging.md`.

Do not preserve the source's structure by default. Reorganize around agent execution:

```text
trigger -> required context -> vocabulary -> workflow -> decisions -> outputs -> validation
```
