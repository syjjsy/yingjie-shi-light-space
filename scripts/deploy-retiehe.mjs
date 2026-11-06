import { createHash } from "node:crypto";
import { writeFile, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

try { process.loadEnvFile(); } catch {}

const domain = process.env.RTH_SITE_DOMAIN;
if (!process.env.RTH_API_KEY) throw new Error("RTH_API_KEY is missing. Put it in .env; never commit that file.");
if (!domain) throw new Error("RTH_SITE_DOMAIN is missing. Put the free Retiehe domain in .env.");

const cliUrl = "https://host.retiehe.com/cli";
const auditedSha256 = "4a2f2b1c6ca3c6f90147089a1ae1d87ba7689f70c8de5bbc70cb63ccdcc5297b";
const cliPath = path.join(tmpdir(), `retiehe-cli-${process.pid}.mjs`);

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", env: process.env });
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`)));
    child.on("error", reject);
  });
}

await run("npm", ["run", "build"]);

const response = await fetch(cliUrl, { redirect: "follow" });
if (!response.ok) throw new Error(`Could not download official Retiehe CLI: HTTP ${response.status}`);
const cli = Buffer.from(await response.arrayBuffer());
const actualSha256 = createHash("sha256").update(cli).digest("hex");
if (actualSha256 !== auditedSha256) {
  throw new Error(`The official Retiehe CLI changed (SHA-256 ${actualSha256}). Inspect the new script before updating auditedSha256 in scripts/deploy-retiehe.mjs.`);
}

await writeFile(cliPath, cli, { mode: 0o600 });
try {
  await run(process.execPath, [cliPath, "deploy", "--site", domain, "--outdir", "dist"]);
} finally {
  await unlink(cliPath).catch(() => {});
}
