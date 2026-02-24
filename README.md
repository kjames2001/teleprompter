![Imaginary Teleprompter](https://github.com/ImaginarySense/Imaginary-Teleprompter-Electron/raw/master/build/install-spinner.png)

[![GitHub license](https://img.shields.io/badge/license-GPL3-blue.svg)](https://raw.githubusercontent.com/ImaginarySense/Imaginary-Teleprompter/master/LICENSE)
[![GitHub release](https://img.shields.io/github/release/ImaginarySense/Imaginary-Teleprompter-Electron.svg)](https://github.com/ImaginarySense/Imaginary-Teleprompter-Electron/releases)
[![Docker Hub](https://img.shields.io/docker/pulls/kjames2001/teleprompter.svg)](https://hub.docker.com/r/kjames2001/teleprompter)

# Imaginary Teleprompter

A fork with Docker support, inverted mouse scroll, and server-side data persistence.

## Features

- **Docker Support** - Run as a containerized web app
- **Inverted Mouse Scroll** - Scroll down to go forward (telemetry-friendly)
- **Server-side Persistence** - All settings and scripts saved to server filesystem
- **Auto-sync** - Automatically syncs from upstream and builds on changes

## Quick Start

```bash
# Run with persistent storage
docker run -d -p 3000:3000 \
  -v /path/to/data:/app/data \
  -v /path/to/uploads:/app/uploads \
  kjames2001/teleprompter:latest
```

Then open http://localhost:3000 in your browser.

## Volumes

| Path | Description |
|------|-------------|
| `/app/data` | Settings, sessions, saved scripts |
| `/app/uploads` | Uploaded images and files |

## Upstream

This fork automatically syncs from [ImaginarySense/Imaginary-Teleprompter](https://github.com/ImaginarySense/Imaginary-Teleprompter) every hour.

## License

This software is under [GPL3](https://github.com/kjames2001/teleprompter/blob/master/LICENSE) license.
