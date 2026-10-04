# Dockerfile patterns

Skeletons per runtime. Replace every `<tag>@<digest>` with a current, pinned value (step 3 of the skill), and adjust paths, ports and commands to the project. Upstream guides, worth a fetch when the project departs from these shapes:

- pnpm - <https://pnpm.io/docker>
- uv - <https://docs.astral.sh/uv/guides/integration/docker/>
- Bun - <https://bun.com/guides/ecosystem/docker>
- Cache mounts per package manager - <https://docs.docker.com/build/cache/optimize/>

## Node.js with pnpm

```dockerfile
# syntax=docker/dockerfile:1
FROM node:<tag>@<digest> AS build
WORKDIR /app
RUN npm install -g pnpm@<version-from-packageManager-field>
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store
COPY . .
RUN pnpm build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod --store-dir /pnpm/store

FROM gcr.io/distroless/nodejs<major>-debian13:nonroot@<digest>
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
USER 65532:65532
EXPOSE 3000
CMD ["dist/index.js"]
```

The distroless Node image's entrypoint is already `node`, so `CMD` holds only the script. In a pnpm workspace, replace the `--prod` reinstall with `pnpm deploy --filter=<app> --prod /out` and copy `/out`. For npm, swap in `npm ci` with `--mount=type=cache,target=/root/.npm`.

## Node.js with Bun

```dockerfile
# syntax=docker/dockerfile:1
FROM oven/bun:<tag>@<digest> AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --production
COPY . .

FROM oven/bun:<tag>@<digest>
WORKDIR /app
COPY --from=build /app ./
USER bun
EXPOSE 3000
ENTRYPOINT ["bun", "run", "src/index.ts"]
```

The `oven/bun` images ship a `bun` user; check its UID with `docker run --rm --entrypoint id oven/bun:<tag>` and write it numerically if the orchestrator enforces `runAsNonRoot`.

## Python with uv

```dockerfile
# syntax=docker/dockerfile:1
FROM python:<tag>-slim@<digest> AS build
COPY --from=ghcr.io/astral-sh/uv:<tag>@<digest> /uv /bin/
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy UV_NO_DEV=1
WORKDIR /app
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project --no-editable
COPY . .
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-editable

FROM python:<tag>-slim@<digest>
RUN groupadd --system --gid 10001 app && useradd --system --uid 10001 --gid 10001 app
WORKDIR /app
COPY --from=build --chown=10001:10001 /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"
USER 10001:10001
EXPOSE 8000
HEALTHCHECK CMD ["python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and runtime stages must share the same Python minor version, because the venv links to the interpreter path. For `requirements.txt` projects without uv, use `pip install` with `--mount=type=cache,target=/root/.cache/pip`.

## Go

```dockerfile
# syntax=docker/dockerfile:1
FROM golang:<tag>@<digest> AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download
COPY . .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/app ./cmd/app

FROM gcr.io/distroless/static-debian13:nonroot@<digest>
COPY --from=build /out/app /app
USER 65532:65532
EXPOSE 8080
ENTRYPOINT ["/app"]
```

With cgo, build normally and use `gcr.io/distroless/base-debian13` instead of `static`.

## Healthchecks for images without a shell

Distroless images have no `curl` or `wget`. A Compose `healthcheck` also runs inside the container, so it has the same limit. Either ship a small health subcommand in the app (`HEALTHCHECK CMD ["/app", "healthcheck"]`, or `["/nodejs/bin/node", "healthcheck.js"]` on distroless Node), or rely on a Kubernetes `httpGet` probe, which the kubelet runs from outside the container.
