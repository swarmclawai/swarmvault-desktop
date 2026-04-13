import { copyFile, rm } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const releaseDir = path.join(appRoot, "release");

const aliases = [
  {
    from: "SwarmVault-linux-x86_64.AppImage",
    to: "SwarmVault-linux-x64.AppImage",
  },
];

async function main() {
  for (const alias of aliases) {
    const source = path.join(releaseDir, alias.from);
    const target = path.join(releaseDir, alias.to);
    await rm(target, { force: true });
    try {
      await copyFile(source, target);
      console.log(`Created ${alias.to}`);
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
        continue;
      }
      throw error;
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
