import { Client } from "@dagger.io/dagger";

export enum Job {
  deploy = "deploy",
}

export const deploy = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const ctr = client
    .pipeline(Job.deploy)
    .container()
    .from("alpine:latest")
    .withExec(["apk", "update"])
    .withExec(["apk", "add", "curl", "bash"])
    .withExec(["sh", "-c", "curl -L https://fly.io/install.sh | sh"])
    .withEnvVariable("FLYCTL_INSTALL", "/root/.fly")
    .withExec(["ln", "-s", "$FLYCTL_INSTALL/flyctl", "/usr/local/bin/fly"])
    .withEnvVariable("PATH", "$FLYCTL_INSTALL/bin:$PATH", { expand: true })
    .withDirectory("/app", context, {
      exclude: [".git", ".devbox", "node_modules", ".fluentci"],
    })
    .withWorkdir("/app")
    .withEnvVariable("FLY_API_TOKEN", Deno.env.get("FLY_API_TOKEN") || "")
    .withExec(["sh", "-c", "fly deploy --remote-only"]);

  const result = await ctr.stdout();

  console.log(result);
};

export type JobExec = (
  client: Client,
  src?: string
) =>
  | Promise<void>
  | ((
      client: Client,
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<void>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.deploy]: deploy,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.deploy]: "Deploy to Fly.io",
};
