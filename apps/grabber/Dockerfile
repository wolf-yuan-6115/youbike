FROM oven/bun:1 AS base

WORKDIR /usr/src/app
COPY . .

RUN bun install --frozen-lockfile
USER bun

ENTRYPOINT [ "bun", "run", "index.ts" ]