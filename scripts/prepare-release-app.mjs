import { cp, readFile, rm, stat, writeFile } from "fs/promises";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const workspaceRoot = path.resolve(appRoot, "..");
const stageDir = path.join(appRoot, ".release-app");
const deployDir = path.join(workspaceRoot, "tmp", "desktop-release-app-deploy");
const requiredBuildOutputs = [
  path.join(appRoot, "out", "main", "index.js"),
  path.join(appRoot, "out", "preload", "index.js"),
  path.join(appRoot, "out", "renderer", "index.html"),
];

async function ensureBuildOutputs() {
  for (const filePath of requiredBuildOutputs) {
    try {
      await stat(filePath);
    } catch {
      throw new Error(
        `Missing build output ${path.relative(appRoot, filePath)}. Run "pnpm build" before packaging.`,
      );
    }
  }
}

async function main() {
  await ensureBuildOutputs();
  await rm(deployDir, { recursive: true, force: true });
  await rm(stageDir, { recursive: true, force: true });

  await execFileAsync(
    "pnpm",
    [
      "--filter",
      "swarmvault-desktop",
      "deploy",
      "--legacy",
      "--prod",
      deployDir,
    ],
    {
      cwd: appRoot,
      maxBuffer: 1024 * 1024 * 32,
    },
  );

  await cp(deployDir, stageDir, {
    recursive: true,
    force: true,
    dereference: true,
  });
  await cp(path.join(appRoot, "out"), path.join(stageDir, "out"), {
    recursive: true,
    force: true,
  });
  await cp(path.join(appRoot, "resources"), path.join(stageDir, "resources"), {
    recursive: true,
    force: true,
  });

  const stagePackagePath = path.join(stageDir, "package.json");
  const packageJson = JSON.parse(await readFile(stagePackagePath, "utf8"));
  delete packageJson.devDependencies;
  delete packageJson.scripts;
  await cp(path.join(appRoot, ".npmrc"), path.join(stageDir, ".npmrc"), {
    force: true,
  });

  await writeFile(stagePackagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
  await rm(deployDir, { recursive: true, force: true });

  console.log(`Prepared release app at ${path.relative(appRoot, stageDir)}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
