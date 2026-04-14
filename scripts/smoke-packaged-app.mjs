import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, rm } from "fs/promises";
import { existsSync } from "fs";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const workspaceTmp = path.resolve(appRoot, "..", "tmp");
const repoRoot = path.resolve(appRoot, "..");
const pdfFixturePath = path.join(
  repoRoot,
  "opensource",
  "smoke",
  "fixtures",
  "tiny-matrix",
  "docs",
  "paper.pdf",
);

const candidateAsars = [
  path.join(appRoot, "release", "mac-arm64", "SwarmVault.app", "Contents", "Resources", "app.asar"),
  path.join(appRoot, "release", "mac", "SwarmVault.app", "Contents", "Resources", "app.asar"),
  path.join(appRoot, "release", "win-unpacked", "resources", "app.asar"),
  path.join(appRoot, "release", "linux-unpacked", "resources", "app.asar"),
  path.join(appRoot, "release", "linux-arm64-unpacked", "resources", "app.asar"),
];

function resolveAsarPath() {
  if (process.argv[2]) return path.resolve(process.argv[2]);
  const existing = candidateAsars.find((candidate) => existsSync(candidate));
  if (!existing) {
    throw new Error("No packaged app.asar found. Pass the app.asar path explicitly.");
  }
  return existing;
}

function describeArtifact(asarPath) {
  const normalized = asarPath.replace(/\\/g, "/");

  if (normalized.includes("/release/win-unpacked/")) {
    return {
      packageName: "@napi-rs/canvas-win32-x64-msvc",
      binaryName: "skia.win32-x64-msvc.node",
      canExecuteCli: process.platform === "win32" && process.arch === "x64",
      label: "Windows x64",
      executablePath: path.join(path.dirname(path.dirname(asarPath)), "SwarmVault.exe"),
    };
  }

  if (normalized.includes("/release/linux-arm64-unpacked/")) {
    return {
      packageName: "@napi-rs/canvas-linux-arm64-gnu",
      binaryName: "skia.linux-arm64-gnu.node",
      canExecuteCli: process.platform === "linux" && process.arch === "arm64",
      label: "Linux arm64",
      executablePath: path.join(path.dirname(path.dirname(asarPath)), "swarmvault-desktop"),
    };
  }

  if (normalized.includes("/release/linux-unpacked/")) {
    return {
      packageName: "@napi-rs/canvas-linux-x64-gnu",
      binaryName: "skia.linux-x64-gnu.node",
      canExecuteCli: process.platform === "linux" && process.arch === "x64",
      label: "Linux x64",
      executablePath: path.join(path.dirname(path.dirname(asarPath)), "swarmvault-desktop"),
    };
  }

  if (normalized.includes("/release/mac-arm64/")) {
    return {
      packageName: "@napi-rs/canvas-darwin-arm64",
      binaryName: "skia.darwin-arm64.node",
      canExecuteCli: process.platform === "darwin" && process.arch === "arm64",
      label: "macOS arm64",
      executablePath: path.join(path.dirname(path.dirname(asarPath)), "MacOS", "SwarmVault"),
    };
  }

  if (normalized.includes("/release/mac/")) {
    return {
      packageName: "@napi-rs/canvas-darwin-x64",
      binaryName: "skia.darwin-x64.node",
      canExecuteCli: process.platform === "darwin" && process.arch === "x64",
      label: "macOS x64",
      executablePath: path.join(path.dirname(path.dirname(asarPath)), "MacOS", "SwarmVault"),
    };
  }

  throw new Error(`Unsupported packaged artifact path: ${asarPath}`);
}

async function main() {
  const asarPath = resolveAsarPath();
  const unpackedPath = `${asarPath}.unpacked`;
  const artifact = describeArtifact(asarPath);
  const smokeRoot = await mkdtemp(path.join(workspaceTmp, "desktop-packaged-smoke-"));
  const extractedDir = path.join(smokeRoot, "extracted");
  const workspaceDir = path.join(smokeRoot, "workspace");
  const asarBin = path.join(appRoot, "node_modules", ".bin", "asar");
  const cliEntry = path.join(
    extractedDir,
    "node_modules",
    "@swarmvaultai",
    "cli",
    "dist",
    "index.js",
  );
  const nativeBinaryPath = path.join(
    unpackedPath,
    "node_modules",
    ...artifact.packageName.split("/"),
    artifact.binaryName,
  );
  const packagedCliEntry = path.join(
    asarPath,
    "node_modules",
    "@swarmvaultai",
    "cli",
    "dist",
    "index.js",
  );

  try {
    await execFileAsync(asarBin, ["extract", asarPath, extractedDir], {
      cwd: appRoot,
      maxBuffer: 1024 * 1024 * 32,
    });

    if (existsSync(unpackedPath)) {
      await cp(unpackedPath, extractedDir, {
        recursive: true,
        force: true,
      });
    }

    assert.ok(
      existsSync(nativeBinaryPath),
      `Missing packaged native canvas binary for ${artifact.label}: ${nativeBinaryPath}`,
    );
    assert.ok(existsSync(cliEntry), `Missing packaged CLI entry: ${cliEntry}`);
    assert.ok(
      existsSync(artifact.executablePath),
      `Missing packaged executable for ${artifact.label}: ${artifact.executablePath}`,
    );

    if (artifact.canExecuteCli) {
      await mkdir(workspaceDir, { recursive: true });

      const runtimeEnv = {
        ...process.env,
        ELECTRON_RUN_AS_NODE: "1",
        FORCE_COLOR: "0",
        NO_UPDATE_NOTIFIER: "1",
      };

      await execFileAsync(artifact.executablePath, [packagedCliEntry, "--help"], {
        cwd: smokeRoot,
        env: runtimeEnv,
        maxBuffer: 1024 * 1024 * 32,
      });

      await execFileAsync(artifact.executablePath, [packagedCliEntry, "--json", "init"], {
        cwd: workspaceDir,
        env: runtimeEnv,
        maxBuffer: 1024 * 1024 * 32,
      });

      const ingest = await execFileAsync(
        artifact.executablePath,
        [packagedCliEntry, "--json", "ingest", pdfFixturePath],
        {
          cwd: workspaceDir,
          env: runtimeEnv,
          maxBuffer: 1024 * 1024 * 32,
        },
      );
      const parsed = JSON.parse(ingest.stdout);
      const manifests = parsed.imported ?? parsed.created ?? [];
      assert.ok(Array.isArray(manifests) && manifests.length > 0, "Packaged PDF ingest did not return manifests");
    }

    console.log(
      `Packaged smoke passed for ${path.relative(appRoot, asarPath)} (${artifact.label})`,
    );
  } finally {
    await rm(smokeRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
