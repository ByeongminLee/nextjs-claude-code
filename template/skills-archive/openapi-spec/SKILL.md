# OpenAPI 3.x Specification Patterns

## Structure
```yaml
openapi: 3.1.0
info:
  title: API Name
  version: 1.0.0
paths:
  /resource:
    get:
      operationId: listResources
      tags: [resources]
      parameters: [{ $ref: '#/components/parameters/Pagination' }]
      responses:
        '200': { $ref: '#/components/responses/ResourceList' }
components:
  schemas: {}
  parameters: {}
  responses: {}
  securitySchemes: {}
```

## Best Practices
- **operationId**: camelCase, unique per operation (`getUser`, `listOrders`)
- **Tags**: Group endpoints by domain, one primary tag per operation
- **$ref everything**: Reuse schemas, parameters, responses via `$ref`
- **Schema composition**: `allOf` for inheritance, `oneOf` for unions, `discriminator` for polymorphism
- **Pagination**: Standardize with shared parameter + response schema
- **Error responses**: Consistent `{ code: string, message: string }` schema across all errors

## Next.js API Routes
- `next-swagger-doc`: Auto-generate OpenAPI spec from JSDoc comments
- `swagger-jsdoc`: Annotate route handlers with `@openapi` blocks
- Serve spec at `/api/docs` or `/api/openapi.json`

## Code Generation
- `openapi-typescript`: Generate TypeScript types from spec
- `orval` or `openapi-codegen`: Generate API client + React Query hooks
- Validate at CI: `spectral lint openapi.yaml`

## Versioning
- URL path versioning: `/api/v1/resource` (explicit, easy to route)
- Header versioning: `Accept: application/vnd.api.v1+json` (cleaner URLs)
- Keep old versions documented until sunset date
