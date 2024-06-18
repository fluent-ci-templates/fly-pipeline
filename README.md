# Fly Pipeline

[![fluentci pipeline](https://shield.fluentci.io/x/fly_pipeline)](https://pkg.fluentci.io/fly_pipeline)
[![deno module](https://shield.deno.dev/x/fly_pipeline)](https://deno.land/x/fly_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.42)
[![dagger-min-version](https://shield.fluentci.io/dagger/v0.11.7)](https://dagger.io)
[![](https://jsr.io/badges/@fluentci/fly)](https://jsr.io/@fluentci/fly)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/fly-pipeline)](https://codecov.io/gh/fluent-ci-templates/fly-pipeline)
[![ci](https://github.com/fluent-ci-templates/fly-pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/fluent-ci-templates/fly-pipeline/actions/workflows/ci.yml)

A ready-to-use CI/CD Pipeline for deploying your applications to [Fly.io](https://fly.io).

## 🚀 Usage

Run the following command in your project:

```bash
fluentci run fly_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t fly
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
fluentci run .
```

## 🧩 Dagger Module

Use as a [Dagger](https://dagger.io) Module:

```bash
dagger install github.com/fluent-ci-templates/fly-pipeline@main
```

Call a function from the module:

```bash
dagger call deploy --src . --token env:FLY_API_TOKEN
```

## 🛠️ Environment Variables

| Variable      | Description         |
|---------------|---------------------|
| FLY_API_TOKEN | Your Fly API token. |

## ✨ Jobs

| Job     | Description                      |
|---------|----------------------------------|
| deploy  | Deploys your application to Fly. |

```typescript
deploy(
  src: Directory | string,
  token: Secret | string
): Promise<string>
```

## 👨‍💻 Programmatic usage

You can also use this pipeline programmatically:

```typescript
import { deploy } from "jsr:@fluentci/fly";

await deploy(".", Deno.env.get("FLY_API_TOKEN")!);
```
