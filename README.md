# Yasifys Tools

[![Contributors][contributors-shield]][contributors-url]
[![Issues][issues-shield]][issues-url]
[![Forks][forks-shield]][forks-url]
[![Build Status][status-badge]][status-url]
[![MIT License][license-badge]][license-url]
[![Docker Pulls][docker-pulls-badge]][docker-pulls-url]
[![Quality Gate Status](https://sonar.vahngomes.dev/api/project_badges/measure?project=yasifys-tools&metric=alert_status)](https://sonar.vahngomes.dev/dashboard?id=yasifys-tools)

YouTube Downloader is a versatile tool that allows users to easily download YouTube videos in various formats. With this open-source project, you can quickly extract and save videos from YouTube by providing the video URL. The downloader supports popular video formats like MP4 and provides a simple and intuitive user interface.

## Tools

- YouTube video downloader
- TikTok video downloader (coming soon)
- Instagram video downloader (coming soon)
- Facebook video downloader (coming soon)

## Installation

No installation is required to use this website. Simply navigate to the website URL and start using the tools.

## Usage

To use the YouTube video downloader, enter the URL of the video you want to download and click the "Download" button. The video will be downloaded in the highest quality available.

To use the TikTok video downloader, enter the URL of the video you want to download and click the "Download" button. The video will be downloaded without a watermark.

To use the Instagram video downloader, enter the URL of the video you want to download and click the "Download" button. The video will be downloaded in the highest quality available.

To use the Facebook video downloader, enter the URL of the video you want to download and click the "Download" button. The video will be downloaded in the highest quality available.

## License

This project is licensed under the [MIT License](LICENSE).

## Docker

You can find the docker image [here](https://hub.docker.com/r/insidiousfiddler/yasifystools/tags).

### Build

Use the following command from the root project to build the docker image for multiple platforms:

```bash
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 --tag yasifystools .
```

Or use the following command to build the docker image for a single platform:

```bash
docker build --tag yasifystools .
```

### Run

Use the following command to run the official docker image:

```bash
docker pull insidiousfiddler/yasifystools && docker run -it --rm -p 0:3000 insidiousfiddler/yasifystools
```

[contributors-shield]: https://img.shields.io/github/contributors/tyler-Github/YasifysTools.svg
[contributors-url]: https://github.com/tyler-Github/YasifysTools/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/tyler-Github/YasifysTools.svg
[forks-url]: https://github.com/tyler-Github/YasifysTools/network
[issues-shield]: https://img.shields.io/github/issues/tyler-Github/YasifysTools.svg
[issues-url]: https://github.com/tyler-Github/YasifysTools/issues
[status-badge]: https://woodpecker.vahngomes.dev/api/badges/tyler-Github/YasifysTools/status.svg
[status-url]: https://woodpecker.vahngomes.dev/tyler-Github/YasifysTools
[docker-pulls-url]: https://hub.docker.com/r/insidiousfiddler/yasifystools
[docker-pulls-badge]: https://img.shields.io/docker/pulls/insidiousfiddler/yasifystools.svg
[license-url]: LICENSE
[license-badge]: https://img.shields.io/github/license/tyler-Github/YasifysTools.svg
