# SwarmVault Desktop

[![GitHub release](https://img.shields.io/github/v/release/swarmclawai/swarmvault-desktop)](https://github.com/swarmclawai/swarmvault-desktop/releases)
[![license](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A local-first desktop app for [SwarmVault](https://github.com/swarmclawai/swarmvault), the knowledge compiler for AI agents. Manage vaults, visualize knowledge graphs, query sources, and review compiled output without touching the terminal.

![SwarmVault Desktop](https://www.swarmvault.ai/images/screenshots/graph-workspace.png)

## Download

| Platform | Architecture | Download |
|----------|-------------|----------|
| macOS | Apple Silicon | [SwarmVault-0.1.33-arm64.dmg](https://github.com/swarmclawai/swarmvault-desktop/releases/download/desktop-v0.1.33/SwarmVault-0.1.33-arm64.dmg) |
| macOS | Intel | [SwarmVault-0.1.33.dmg](https://github.com/swarmclawai/swarmvault-desktop/releases/download/desktop-v0.1.33/SwarmVault-0.1.33.dmg) |
| Windows | 64-bit | [SwarmVault Setup 0.1.33.exe](https://github.com/swarmclawai/swarmvault-desktop/releases/download/desktop-v0.1.33/SwarmVault.Setup.0.1.33.exe) |
| Linux | x86_64 | [SwarmVault-0.1.33.AppImage](https://github.com/swarmclawai/swarmvault-desktop/releases/download/desktop-v0.1.33/SwarmVault-0.1.33.AppImage) |
| Linux | ARM64 | [SwarmVault-0.1.33-arm64.AppImage](https://github.com/swarmclawai/swarmvault-desktop/releases/download/desktop-v0.1.33/SwarmVault-0.1.33-arm64.AppImage) |

Or visit the [releases page](https://github.com/swarmclawai/swarmvault-desktop/releases) for all versions.

## Features

- **Interactive knowledge graph** with typed nodes, community detection, and provenance-tracked edges
- **Source management** for ingesting documents, code, URLs, and 30+ other formats
- **Wiki browser** for reading and navigating compiled pages, entity profiles, and cross-references
- **Query interface** for searching across your vault
- **Review workflow** for validating and approving compiled output
- **Built-in terminal** showing real-time CLI output
- **Auto-updates** from GitHub releases

## System Requirements

- **macOS** 13 Ventura or later (Apple Silicon or Intel)
- **Windows** 10 or later (64-bit)
- **Linux** Ubuntu 20.04+ or equivalent (x86_64 or ARM64)

## Development

```bash
# Install dependencies
pnpm install

# Start dev server with hot reload
pnpm dev

# Type-check
pnpm typecheck

# Build for production
pnpm build

# Package for current platform
pnpm package

# Package for a specific platform
pnpm package:mac
pnpm package:win
pnpm package:linux
```

### Tech Stack

- **Electron 35** with strict context isolation
- **React 19** and **Tailwind CSS 4** for the renderer
- **electron-vite** for builds
- **electron-builder** for packaging and auto-updates
- **@swarmvaultai/cli** bundled as the core engine

### Architecture

The app follows the standard three-process Electron model. The main process manages the app lifecycle, spawns CLI commands as child processes, and runs a local HTTP server for the graph viewer. The renderer is a React SPA that communicates with main through a preload bridge using typed IPC channels (`vault:*`, `cli:*`, `graph:*`, `app:*`). All node access is isolated behind the preload script.

## License

MIT
