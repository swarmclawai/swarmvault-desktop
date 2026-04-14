import { cp, lstat, mkdir, readFile, readdir, rm, stat, writeFile } from "fs/promises";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const stageDir = path.join(appRoot, ".release-app");
const stageRuntimePackages = [
  "electron-store",
  "electron-updater",
  "@swarmvaultai/cli",
  "@swarmvaultai/engine",
  "pdfjs-dist",
];
const stageNativePackages = [
  "@napi-rs/canvas",
  "@napi-rs/canvas-darwin-arm64",
  "@napi-rs/canvas-darwin-x64",
  "@napi-rs/canvas-linux-arm64-gnu",
  "@napi-rs/canvas-linux-x64-gnu",
  "@napi-rs/canvas-win32-x64-msvc",
];
const stageTempFiles = [".npmrc", "pnpm-lock.yaml", "pnpm-workspace.yaml"];
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

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function copyInstallPackageJson() {
  await cp(path.join(appRoot, "package.json"), path.join(stageDir, "package.json"), {
    force: true,
  });
}

async function writeReleasePackageJson() {
  const releasePackageJson = JSON.parse(
    await readFile(path.join(appRoot, "package.json"), "utf8"),
  );
  delete releasePackageJson.devDependencies;
  delete releasePackageJson.scripts;
  await writeFile(
    path.join(stageDir, "package.json"),
    `${JSON.stringify(releasePackageJson, null, 2)}\n`,
  );
}

async function copyStageInstallInputs() {
  for (const filename of stageTempFiles) {
    await cp(path.join(appRoot, filename), path.join(stageDir, filename), {
      force: true,
    });
  }
}

async function installStageDependencies() {
  await execFileAsync(
    "pnpm",
    ["install", "--prod", "--frozen-lockfile", "--config.node-linker=hoisted"],
    {
      cwd: stageDir,
      maxBuffer: 1024 * 1024 * 32,
    },
  );
}

async function assertRequiredStagePackages() {
  for (const packageName of [...stageRuntimePackages, ...stageNativePackages]) {
    const packageDir = path.join(stageDir, "node_modules", ...packageName.split("/"));
    if (!(await pathExists(packageDir))) {
      throw new Error(
        `Missing staged package ${packageName}. Release install did not materialize the required runtime dependency graph.`,
      );
    }
  }
}

async function collectNonBinSymlinks(rootDir, relativeDir = "") {
  const entries = await readdir(path.join(rootDir, relativeDir), { withFileTypes: true });
  const symlinks = [];
  for (const entry of entries) {
    const entryRelativePath = path.posix.join(relativeDir, entry.name);
    const entryPath = path.join(rootDir, entryRelativePath);
    const stats = await lstat(entryPath);
    if (stats.isSymbolicLink()) {
      const inBinDir =
        entryRelativePath === ".bin" ||
        entryRelativePath.startsWith(".bin/") ||
        entryRelativePath.includes("/.bin/") ||
        entryRelativePath.endsWith("/.bin");
      if (!inBinDir) {
        symlinks.push(entryRelativePath);
      }
      continue;
    }
    if (entry.isDirectory()) {
      symlinks.push(...(await collectNonBinSymlinks(rootDir, entryRelativePath)));
    }
  }
  return symlinks;
}

async function assertNoNonBinSymlinks() {
  const nodeModulesDir = path.join(stageDir, "node_modules");
  const symlinks = await collectNonBinSymlinks(nodeModulesDir);
  if (symlinks.length > 0) {
    throw new Error(
      `Staged node_modules still contains runtime symlinks: ${symlinks.slice(0, 10).join(", ")}`,
    );
  }
}

async function removeStageInstallInputs() {
  for (const filename of stageTempFiles) {
    await rm(path.join(stageDir, filename), { force: true });
  }
}

async function main() {
  await ensureBuildOutputs();
  await rm(stageDir, { recursive: true, force: true });
  await mkdir(stageDir, { recursive: true });
  await copyInstallPackageJson();
  await copyStageInstallInputs();
  await installStageDependencies();
  await assertRequiredStagePackages();
  await assertNoNonBinSymlinks();
  await writeReleasePackageJson();
  await removeStageInstallInputs();
  await cp(path.join(appRoot, "out"), path.join(stageDir, "out"), {
    recursive: true,
    force: true,
  });
  await cp(path.join(appRoot, "resources"), path.join(stageDir, "resources"), {
    recursive: true,
    force: true,
  });

  console.log(`Prepared release app at ${path.relative(appRoot, stageDir)}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
