# Storybook Best Practices

## Setup (Next.js)
- Use `@storybook/nextjs` framework for automatic Next.js config support
- Configure `main.ts`: `framework: { name: '@storybook/nextjs' }`
- Stories location: `stories: ['../src/**/*.stories.@(ts|tsx)']`

## Story Structure
```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  component: Button,
  tags: ['autodocs'],           // auto-generate docs page
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
  },
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary', children: 'Click' } };
export const Loading: Story = { args: { loading: true } };
```

## Patterns
- **One component per story file**: `ComponentName.stories.tsx` next to component
- **Args over hardcoded props**: Use `args` for all configurable props
- **Play functions**: Simulate user interactions for interaction testing
- **Decorators**: Wrap stories with providers (theme, router, query client)
- **CSF3 format**: Use `satisfies Meta<typeof Component>` for type safety

## Organization
- Group by domain: `sidebar: { order: ['Atoms', 'Molecules', 'Organisms', 'Pages'] }`
- Use `tags: ['autodocs']` for automatic documentation
- Add `parameters.design` for Figma link integration (with `storybook-addon-designs`)

## Testing Integration
- Visual regression: Chromatic or `@storybook/test-runner`
- Accessibility: `@storybook/addon-a11y` for per-story a11y checks
- Interaction tests: `play` function + `@storybook/testing-library`
