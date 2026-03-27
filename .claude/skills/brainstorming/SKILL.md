---
name: brainstorming
description: Structured brainstorming and design process. Enforces exploration and user approval before any implementation. Covers project context analysis, approach proposals, design documentation, and spec review.
---

# Brainstorming Skill

A structured design process that prioritizes exploration and validation before implementation. Sourced from obra/superpowers.

## Core Principle

**Do NOT invoke any implementation skill, write any code, scaffold any project, or take any implementation action until you have presented a design and the user has approved it.**

Brainstorming is complete only when the user explicitly approves the final design specification.

## Process Flow

Follow these nine steps in order. Do not skip steps.

### Step 1: Explore Project Context
- Review existing files, documentation, and recent commits
- Understand the codebase structure and conventions
- Identify relevant prior work and dependencies
- Note technical constraints and existing patterns

### Step 2: Offer Visual Companion (If Needed)
- As a standalone message, offer to create mockups or diagrams
- Use visual content only when it adds clarity beyond text
- Keep this offer separate from clarifying questions

### Step 3: Ask Clarifying Questions
- Ask **one question at a time** — never batch multiple questions
- Prefer multiple-choice framing when possible
- Focus on understanding:
  - Purpose and goals
  - Constraints and limitations
  - Success criteria
  - User expectations
- Continue until you have sufficient context to propose approaches

### Step 4: Propose 2-3 Approaches
For each approach, present:
- **Description** — what the approach entails
- **Trade-offs** — pros and cons
- **Complexity** — relative effort and risk
- **Recommendation** — which approach you favor and why

Let the user choose or refine before proceeding.

### Step 5: Present Design
Scale documentation to complexity:
- **Simple projects** — a few sentences covering the approach
- **Medium projects** — 100-200 words with key decisions
- **Complex projects** — 200-300 words covering architecture, interfaces, and data flow

Present design in sections and **request approval after each section** before continuing.

### Step 6: Write Design Documentation
Save the approved design to a spec document. Include:
- Problem statement
- Chosen approach with rationale
- System design with component breakdown
- Key interfaces and data flow
- Assumptions and open questions
- Implementation sequence

### Step 7: Spec Review Loop
- Review the spec for completeness, consistency, and feasibility
- Iterate up to 3 times to refine
- Each iteration should address specific concerns or gaps
- Stop iterating when the spec is solid or the limit is reached

### Step 8: User Reviews Final Spec
- Present the complete spec for user approval
- Address any final concerns or modifications
- Do not proceed until explicit approval is received

### Step 9: Transition to Implementation
- Only after approval, create an implementation plan
- Break work into ordered, independently testable tasks
- The only implementation-adjacent action allowed is creating a plan

## Design Principles

### Isolation and Clarity
Every component in the design should answer:
- **What does it do?** — single, clear purpose
- **How is it used?** — well-defined interface
- **What does it depend on?** — explicit dependencies
- **Can it be tested independently?** — verifiable in isolation

### Working with Existing Codebases
- Explore current structure before proposing changes
- Follow existing patterns and conventions
- Address problems that affect the current work
- Avoid unrelated refactoring — note it for later if needed

### Scoping Large Projects
- Break large projects into independently scoped sub-projects
- Each sub-project should be deliverable on its own
- Define clear boundaries and integration points between sub-projects

## Question Strategy

### Effective Questions
- "What problem are you trying to solve?" (open-ended for context)
- "Would you prefer A) server-side rendering or B) client-side rendering?" (multiple choice)
- "What does success look like for this feature?" (success criteria)
- "Are there any hard constraints on technology or timeline?" (constraints)

### Questions to Avoid
- Compound questions that combine multiple topics
- Yes/no questions when you need nuanced answers
- Technical questions before understanding the problem
- Questions about implementation details during the exploration phase

## Anti-Patterns

- **Jumping to code** — writing any implementation before design approval
- **Batch questioning** — asking multiple questions in one message
- **Over-designing** — creating detailed specs for simple tasks
- **Under-exploring** — proposing solutions before understanding the problem
- **Scope creep** — expanding beyond the agreed design during review

## When to Use This Skill

- Starting a new feature or project
- Redesigning an existing system
- Tackling an ambiguous or complex problem
- When the right approach is not immediately obvious
- Before any significant architectural decision

---

*Sourced from [obra/superpowers](https://github.com/obra/superpowers) (MIT License)*
