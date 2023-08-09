import { Client } from "@dagger.io/dagger";
import { withDevbox } from "https://deno.land/x/nix_installer_pipeline@v0.3.6/src/dagger/steps.ts";

export enum Job {
  deploy = "deploy",
}

export const deploy = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const ctr = withDevbox(
    client
      .pipeline(Job.deploy)
      .container()
      .from("alpine:latest")
      .withExec(["apk", "update"])
      .withExec(["apk", "add", "curl", "bash"])
      .withMountedCache("/nix", client.cacheVolume("nix"))
      .withMountedCache("/etc/nix", client.cacheVolume("nix-etc"))
  )
    .withMountedCache(
      "/root/.local/share/devbox/global",
      client.cacheVolume("devbox-global")
    )
    .withExec(["devbox", "global", "add", "flyctl"])
    .withEnvVariable("NIX_INSTALLER_NO_CHANNEL_ADD", "1")
    .withDirectory("/app", context, {
      exclude: [".git", ".devbox", "node_modules", ".fluentci"],
    })
    .withWorkdir("/app")
    .withEnvVariable("FLY_API_TOKEN", Deno.env.get("FLY_API_TOKEN") || "")
    .withExec(["sh", "-c", "devbox global run -- fly deploy --remote-only"]);

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
