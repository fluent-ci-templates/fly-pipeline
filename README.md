# Fly Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Ffly_pipeline&query=%24.version)](https://pkg.fluentci.io/fly_pipeline)
[![deno module](https://shield.deno.dev/x/fly_pipeline)](https://deno.land/x/fly_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/fly-pipeline)](https://codecov.io/gh/fluent-ci-templates/fly-pipeline)

A ready-to-use CI/CD Pipeline for deploying your applications to [Fly.io](https://fly.io).

## 🚀 Usage

Run the following command:

```bash
dagger run fluentci fly_pipeline
```

## Environment Variables

| Variable      | Description         |
|---------------|---------------------|
| FLY_API_TOKEN | Your Fly API token. |

## Jobs

| Job     | Description                      |
|---------|----------------------------------|
| deploy  | Deploys your application to Fly. |

## Programmatic usage

You can also use this pipeline programmatically:

```typescript
import { deploy } from "https://pkg.fluentci.io/fly_pipeline@v0.6.0/mod.ts";

await deploy();
```
