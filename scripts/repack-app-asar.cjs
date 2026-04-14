"use strict";

const { execFile } = require("child_process");
const { access, readdir, rm } = require("fs/promises");
const asar = require("@electron/asar");
const path = require("path");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);
const unpackDirPattern =
  "{node_modules/@swarmvaultai/*,node_modules/@napi-rs/*,node_modules/@vscode/tree-sitter-wasm/wasm,node_modules/tree-sitter-wasms/out,node_modules/pdfjs-dist}";
const unpackPattern = "{*.node,icudtl.dat}";
const requiredRuntimePackages = [
  "node_modules/electron-store",
  "node_modules/electron-updater",
  "node_modules/@swarmvaultai/cli",
  "node_modules/@swarmvaultai/engine",
  "node_modules/pdfjs-dist",
];
const requiredRuntimePackageManifests = [
  "node_modules/electron-store/package.json",
  "node_modules/electron-updater/package.json",
  "node_modules/@swarmvaultai/cli/package.json",
  "node_modules/@swarmvaultai/engine/package.json",
  "node_modules/pdfjs-dist/package.json",
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

function assertArchiveLayout(appAsarPath) {
  for (const packagePath of requiredRuntimePackages) {
    let entry;
    try {
      entry = asar.statFile(appAsarPath, packagePath, false);
    } catch {
      throw new Error(
        `Packaged archive is missing ${packagePath}. Runtime packages must be real directories.`,
      );
    }
    if (entry && entry.link) {
      throw new Error(
        `Packaged archive stored ${packagePath} as a link (${entry.link}). Runtime packages must be real directories.`,
      );
    }
  }

  for (const manifestPath of requiredRuntimePackageManifests) {
    try {
      asar.statFile(appAsarPath, manifestPath, false);
    } catch (error) {
      throw new Error(
        `Packaged archive is missing ${manifestPath}. Runtime package contents were not bundled correctly.`,
      );
    }
  }
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

  const args = [
    "pack",
    "--unpack-dir",
    unpackDirPattern,
    "--unpack",
    unpackPattern,
    stageDir,
    appAsarPath,
  ];

  await execFileAsync(asarBin, args, {
    cwd: projectDir,
    maxBuffer: 1024 * 1024 * 32,
  });

  assertArchiveLayout(appAsarPath);
};
