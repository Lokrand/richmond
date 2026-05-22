## Run dev server

```bash
pnpm dev
```

on [http://localhost:3000](http://localhost:3000)

## API Client Configuration

Set the API URL in `.env.local` or `cp .env.local.example .env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_BASE_S3_URL=http://localhost:9900
```

## API Client Generation

The TypeScript API client is generated from the OpenAPI spec using `openapi-generator`.

### Prerequisites

- Local API must be running at `http://localhost:8080/doc.json`
 or use test server at `https://richmond-api.akorz.duckdns.org/swagger/doc.json`
- Swagger spec available at `http://localhost:8080/swagger/index.html`

### Generate Client

Run this command from the project root:

```bash
pnpm dlx @openapitools/openapi-generator-cli@2.31.1 generate -i http://localhost:8080/swagger/doc.json  -g typescript-fetch  -o src/client  --additional-properties=typescriptVersion=5.0.0
```
