import { cp, mkdtemp, rm } from "fs/promises";
import { existsSync } from "fs";
import { execFile, spawn } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const workspaceTmp = path.resolve(appRoot, "..", "tmp");

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

function runIsolatedElectron(asarPath) {
  const electronBin = path.join(appRoot, "node_modules", ".bin", "electron");
  return new Promise((resolve, reject) => {
    const child = spawn(electronBin, [asarPath], {
      cwd: workspaceTmp,
      env: {
        ...process.env,
        ELECTRON_DISABLE_SECURITY_WARNINGS: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let output = "";
    let settled = false;

    const finish = (error) => {
      if (settled) return;
      settled = true;
      child.kill("SIGTERM");
      setTimeout(() => child.kill("SIGKILL"), 1_000).unref();
      if (error) {
        reject(error);
      } else {
        resolve(output);
      }
    };

    const onData = (chunk) => {
      output += chunk.toString();
      if (output.includes("App threw an error during load")) {
        finish(new Error(output.trim()));
      }
    };

    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.on("exit", (code) => {
      if (settled) return;
      if (code && code !== 0) {
        finish(new Error(output.trim() || `Electron exited with code ${code}`));
        return;
      }
      finish();
    });
    child.on("error", finish);

    setTimeout(() => finish(), 4_000).unref();
  });
}

async function main() {
  const asarPath = resolveAsarPath();
  const smokeRoot = await mkdtemp(path.join(workspaceTmp, "desktop-packaged-smoke-"));
  const isolatedAsarPath = path.join(smokeRoot, "app.asar");
  const extractedDir = path.join(smokeRoot, "extracted");
  const asarBin = path.join(appRoot, "node_modules", ".bin", "asar");
  const cliEntry = path.join(
    extractedDir,
    "node_modules",
    "@swarmvaultai",
    "cli",
    "dist",
    "index.js",
  );

  try {
    await cp(asarPath, isolatedAsarPath);
    await runIsolatedElectron(isolatedAsarPath);

    await execFileAsync(asarBin, ["extract", asarPath, extractedDir], {
      cwd: appRoot,
      maxBuffer: 1024 * 1024 * 32,
    });

    await execFileAsync(process.execPath, [cliEntry, "--help"], {
      cwd: smokeRoot,
      env: {
        ...process.env,
        FORCE_COLOR: "0",
        NO_UPDATE_NOTIFIER: "1",
      },
      maxBuffer: 1024 * 1024 * 32,
    });

    console.log(`Packaged smoke passed for ${path.relative(appRoot, asarPath)}`);
  } finally {
    await rm(smokeRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
