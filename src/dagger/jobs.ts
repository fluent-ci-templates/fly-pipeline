/**
 * @module fly
 * @description This module provides a function to deploy applications to Fly.io
 */
import { Directory, Secret, dag, exit } from "../../deps.ts";
import { getDirectory, getFlyApiToken } from "./lib.ts";

export enum Job {
  deploy = "deploy",
}

export const exclude = [".devbox", "node_modules", ".fluentci"];

/**
 * Deploy to Fly.io
 *
 * @function
 * @description Deploy to Fly.io
 * @param {Directory | string} src The directory to deploy
 * @param {Secret | string} token Fly.io Access Token
 * @returns {Promise<string>}
 */
export async function deploy(
  src: Directory | string,
  token: Secret | string
): Promise<string> {
  const context = await getDirectory(src);
  const secret = await getFlyApiToken(token);

  if (!secret) {
    console.error("FLY_API_TOKEN not found");
    exit(1);
    return "";
  }

  const ctr = dag
    .pipeline(Job.deploy)
    .container()
    .from("alpine:latest")
    .withExec(["apk", "update"])
    .withExec(["apk", "add", "curl", "bash", "git"])
    .withExec(["sh", "-c", "curl -L https://fly.io/install.sh | sh"])
    .withEnvVariable("FLYCTL_INSTALL", "/root/.fly")
    .withExec(["ln", "-s", "$FLYCTL_INSTALL/flyctl", "/usr/local/bin/fly"])
    .withEnvVariable("PATH", "$FLYCTL_INSTALL/bin:$PATH", { expand: true })
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withSecretVariable("FLY_API_TOKEN", secret)
    .withExec(["sh", "-c", "fly deploy --remote-only"]);

  return ctr.stdout();
}

export type JobExec = (
  src: Directory | string,
  token: Secret | string
) => Promise<string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.deploy]: deploy,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.deploy]: "Deploy to Fly.io",
};
