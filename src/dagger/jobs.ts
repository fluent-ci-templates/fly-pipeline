import Client, { Directory, Secret } from "../../deps.ts";
import { connect } from "../../sdk/connect.ts";
import { getDirectory, getFlyApiToken } from "./lib.ts";

export enum Job {
  deploy = "deploy",
}

export const exclude = [".git", ".devbox", "node_modules", ".fluentci"];

/**
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
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const secret = getFlyApiToken(client, token);

    if (!secret) {
      console.error("FLY_API_TOKEN not found");
      Deno.exit(1);
    }

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
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withSecretVariable("FLY_API_TOKEN", secret)
      .withExec(["sh", "-c", "fly deploy --remote-only"]);

    const result = await ctr.stdout();

    console.log(result);
  });
  return "done";
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
