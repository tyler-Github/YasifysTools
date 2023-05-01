# Yasifys Tools

[![Contributors][contributors-shield]][contributors-url]
[![Issues][issues-shield]][issues-url]
[![Forks][forks-shield]][forks-url]

## Docker

You can find the docker image [here](https://hub.docker.com/r/insidiousfiddler/yasifystools/tags). The image is based on node Alpine Linux and is about 50MB in size.

### Build

Run the following command from the root project to build the docker image:

```bash
docker buildx build --platform linux/amd64,linux/arm64 --tag insidiousfiddler/yasifystools:{version} --push .
```

## Usage

This project is a collection of tools too download videos from various websites. The tools are written in NodeJS and can be used as a command line tool or as a library.

[contributors-shield]: https://img.shields.io/github/contributors/tyler-Github/YasifysTools.svg?style=for-the-badge
[contributors-url]: https://github.com/tyler-Github/YasifysTools/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/tyler-Github/YasifysTools.svg?style=for-the-badge
[forks-url]: https://github.com/tyler-Github/YasifysTools/network
[issues-shield]: https://img.shields.io/github/issues/tyler-Github/YasifysTools.svg?style=for-the-badge
[issues-url]: https://github.com/tyler-Github/YasifysTools/issues
