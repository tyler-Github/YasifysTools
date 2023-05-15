# Yasifys Tools

[![Contributors][contributors-shield]][contributors-url]
[![Issues][issues-shield]][issues-url]
[![Forks][forks-shield]][forks-url]

A website with tools to download videos from popular social media platforms.

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

You can find the docker image [here](https://hub.docker.com/r/insidiousfiddler/yasifystools/tags). The image is based on node Alpine Linux and is about 50MB in size.

### Build

Use the following command from the root project to build the docker image for multiple platforms:

```bash
docker buildx build --platform linux/amd64,linux/arm64 --tag yasifystools .
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

[contributors-shield]: https://img.shields.io/github/contributors/tyler-Github/YasifysTools.svg?style=for-the-badge
[contributors-url]: https://github.com/tyler-Github/YasifysTools/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/tyler-Github/YasifysTools.svg?style=for-the-badge
[forks-url]: https://github.com/tyler-Github/YasifysTools/network
[issues-shield]: https://img.shields.io/github/issues/tyler-Github/YasifysTools.svg?style=for-the-badge
[issues-url]: https://github.com/tyler-Github/YasifysTools/issues
