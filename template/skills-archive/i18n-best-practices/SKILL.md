# Internationalization (i18n) Best Practices

## Library Choice
- **next-intl**: Recommended for Next.js App Router (RSC-compatible, type-safe)
- **react-intl**: ICU MessageFormat, good for complex plurals/gender
- **i18next + react-i18next**: Framework-agnostic, largest ecosystem

## Next.js App Router Setup (next-intl)
```
src/
  i18n/
    request.ts          # getRequestConfig()
    routing.ts          # defineRouting({ locales, defaultLocale })
  messages/
    en.json
    ko.json
  middleware.ts          # createMiddleware(routing)
  app/
    [locale]/
      layout.tsx         # NextIntlClientProvider
      page.tsx           # useTranslations('namespace')
```

## Key Patterns
- **Namespace separation**: Group by feature (`auth.login`, `dashboard.title`)
- **Type-safe keys**: Generate types from default locale JSON
- **Pluralization**: Use ICU format `{count, plural, one {# item} other {# items}}`
- **Date/Number formatting**: Use `useFormatter()` (next-intl) or `Intl` API, never manual formatting
- **Server Components**: `getTranslations()` in RSC, `useTranslations()` in client
- **Dynamic messages**: Avoid string concatenation; use interpolation `t('greeting', { name })`

## Common Mistakes
- Hardcoded strings in components (use extraction tools: `i18n-ally` VSCode extension)
- Locale in URL path AND cookie (pick one strategy)
- Missing fallback locale handling
- Not accounting for text expansion (German ~30% longer than English)
- Date/currency formatting without locale context
