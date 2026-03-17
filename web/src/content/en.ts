export const en = {
  lang: 'en',
  title: 'NCC',
  subtitle: 'nextjs-claude-code',
  tagline: 'Spec-Driven AI Development workflow for Next.js & React — from spec to shipped with Claude Code.',
  description: 'Define your feature. Claude builds exactly what the spec says — with every change traced back to a requirement.',

  features: {
    title: 'Features',
    items: [
      { bold: 'Spec-Driven', text: 'Feature specs with REQ-NNN traceability, compliance reporting' },
      { bold: 'Curated skills', text: 'from skills.sh (community skill registry for Claude Code) — includes React, Next.js, UI/UX, testing, and library-specific best practices' },
      { bold: 'Architecture guides', text: 'Flat, Feature-Based, FSD, Monorepo (chosen by team size)' },
      { bold: 'Library-aware agents', text: 'agents read your selected stack and follow its patterns' },
      { bold: 'Next.js native', text: 'App Router, Server Components, Server Actions, Pages Router' },
      { bold: 'React support', text: 'Vite and other React setups' },
      { bold: 'Monorepo ready', text: 'Turborepo workspace-aware installation' },
      { bold: 'Claude Code native', text: 'slash commands, multi-agent coordination, PostToolUse hooks' },
    ],
  },

  prerequisites: {
    title: 'Prerequisites',
    items: [
      'Node.js >= 18',
      'Claude Code installed and configured',
    ],
  },

  installation: {
    title: 'Installation',
    human: 'For Humans',
    humanLink: 'https://github.com/ByeongminLee/nextjs-claude-code/blob/main/docs/installation.md',
    claude: 'For Claude Code — fetch the guide and follow it:',
    command: 'curl -s https://raw.githubusercontent.com/ByeongminLee/nextjs-claude-code/main/docs/installation.md',
  },

  whySdd: {
    title: 'Why SDD?',
    paragraphs: [
      'Features are never completed in a single iteration. You ship a basic checkout, add coupons a month later, then subscriptions, then promotions. At every step you need to know what was built before, what the current spec looks like, and what changed.',
      'Existing spec-driven tools like Spec-kit and OpenSpec work well for independent changes, but their change-based folder structure makes it hard to see how a single feature evolves over time.',
    ],
    example: `/spec payment-coupon "add coupon support to payment, Figma: https://..."   # define the spec
/dev payment-coupon                                                         # implement`,
    points: [
      { bold: 'Feature-unit, not change-unit.', text: 'Each feature has a fixed location (spec/feature/[name]/) that persists throughout the project lifetime.' },
      { bold: 'Built for progressive development.', text: 'Spec, design, and implementation history live together so each iteration builds on the last.' },
      { bold: 'Spec accuracy over speed.', text: 'spec-writer clarifies before writing, lead-engineer follows a confirmed plan, verifier checks "it works" not just "files exist."' },
    ],
    who: {
      title: 'Who is this for?',
      text: 'NCC is optimized for teams that iteratively implement confirmed specs on a feature-by-feature basis. It is for teams whose features keep evolving after launch.',
    },
  },

  workflow: {
    title: 'Workflow',
    description: 'The core SDD loop — define what to build, then build it.',
    commands: `/spec [name] "describe the feature"   →  spec-writer clarifies → writes spec.md + design.md
/dev  [name]                           →  planner → lead-engineer → verifier → done
/dev  [name] --team                    →  planner → lead-engineer (+ db/ui/worker team) → verifier → done`,
  },

  ops: {
    title: 'Commands',
    sections: [
      {
        subtitle: 'Review & Quality',
        commands: [
          { cmd: '/review [name]', desc: 'Spec compliance + code quality review' },
          { cmd: '/loop [name]', desc: 'Repeat review → fix → re-review until all REQs pass (max 5)' },
          { cmd: '/test [name]', desc: 'Run tests based on TEST_STRATEGY.md' },
          { cmd: '/log [name]', desc: 'Audit logging practices' },
          { cmd: '/security [name]', desc: 'Security audit (OWASP Top 10)' },
        ],
      },
      {
        subtitle: 'Git & Release',
        commands: [
          { cmd: '/commit [name]', desc: 'Auto-generate commit message from diff' },
          { cmd: '/pr [name] [target]', desc: 'Create PR with spec-based body' },
        ],
      },
      {
        subtitle: 'Infrastructure',
        commands: [
          { cmd: '/cicd', desc: 'Set up CI/CD pipeline' },
        ],
      },
      {
        subtitle: 'Dev Utilities',
        commands: [
          { cmd: '/init', desc: 'Analyze existing codebase and populate spec documents' },
          { cmd: '/debug "..."', desc: 'Hypothesis-driven bug analysis' },
          { cmd: '/status', desc: 'Project status summary' },
          { cmd: '/rule "..."', desc: 'Add or update coding rules' },
        ],
      },
    ],
  },

  agents: {
    title: 'Agent Roles',
    description: 'Claude Code agents work in coordination, each with specific responsibilities and permissions.',
    core: {
      subtitle: 'Core Agents',
      items: [
        { name: 'spec-writer', role: 'Write spec.md + design.md' },
        { name: 'planner', role: 'Create CONTEXT.md + PLAN.md' },
        { name: 'lead-engineer', role: 'Implement features (solo or team leader)' },
        { name: 'verifier', role: '4-level verification' },
      ],
    },
    team: {
      subtitle: 'Team Engineers (/dev --team)',
      items: [
        { name: 'db-engineer', role: 'Schema, migrations, ORM, queries' },
        { name: 'ui-engineer', role: 'Components, styling, animations' },
        { name: 'worker-engineer', role: 'Simple utils, types, config' },
      ],
    },
  },

  safety: {
    title: 'Safety Features',
    items: [
      { bold: 'Checkpoints', text: 'lead-engineer pauses for user confirmation at decision points, UI milestones, and auth/payment gates' },
      { bold: 'Auto-fix Budget', text: 'Maximum 3 retries per mode — error analysis → alternative approach → minimal change → escalation' },
      { bold: 'Verification Levels', text: '4 levels from file existence to browser verification' },
      { bold: 'Resume Protocol', text: 'Interrupted /dev sessions resume from where they left off' },
      { bold: 'Spec Validation', text: 'PostToolUse hooks block malformed spec writes and remind spec updates' },
    ],
  },

  contributing: {
    title: 'Contributing',
    text: 'Issues and PRs welcome.',
    repo: 'https://github.com/ByeongminLee/nextjs-claude-code',
  },

  license: 'MIT',
};
