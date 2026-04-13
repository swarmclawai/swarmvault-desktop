"use strict";

const { execFile } = require("child_process");
const { access, readdir, rm } = require("fs/promises");
const path = require("path");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);
const unpackDirs = [
  "node_modules/@swarmvaultai",
  "node_modules/@vscode/tree-sitter-wasm/wasm",
  "node_modules/tree-sitter-wasms/out",
  "node_modules/pdfjs-dist",
];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function findAppAsar(rootDir, depth = 0) {
  if (depth > 5) return null;

  const directCandidate = path.join(rootDir, "app.asar");
  if (await exists(directCandidate)) {
    return directCandidate;
  }

  const entries = await readdir(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const nestedPath = await findAppAsar(path.join(rootDir, entry.name), depth + 1);
    if (nestedPath) {
      return nestedPath;
    }
  }

  return null;
}

exports.default = async function afterPack(context) {
  const projectDir = context.packager.projectDir;
  const stageDir = path.join(projectDir, ".release-app");
  const asarBin = path.join(projectDir, "node_modules", ".bin", "asar");
  const appAsarPath = await findAppAsar(context.appOutDir);

  if (!appAsarPath) {
    throw new Error(`Could not locate app.asar under ${context.appOutDir}`);
  }

  await rm(appAsarPath, { force: true });
  await rm(`${appAsarPath}.unpacked`, { recursive: true, force: true });

  const args = ["pack", stageDir, appAsarPath];
  for (const unpackDir of unpackDirs) {
    args.push("--unpack-dir", unpackDir);
  }

  await execFileAsync(asarBin, args, {
    cwd: projectDir,
    maxBuffer: 1024 * 1024 * 32,
  });
};
