# Fly Pipeline

[![deno module](https://shield.deno.dev/x/fly_pipeline)](https://deno.land/x/fly_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/fly-pipeline)](https://codecov.io/gh/fluent-ci-templates/fly-pipeline)

A ready-to-use CI/CD Pipeline for deploying your applications to [Fly](https://fly.io).

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
import { Client, connect } from "https://esm.sh/@dagger.io/dagger@0.8.1";
import { Dagger } from "https://deno.land/x/fly_pipeline/mod.ts";

const { deploy } = Dagger;

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await deploy(client, src);
  });
}

pipeline();

```
