---
name: containerize
description: Containerise the current project - Dockerfile, .dockerignore and compose.yaml with current Docker practice.
disable-model-invocation: true
argument-hint: "[runtime or service to containerise]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - WebFetch
  - Bash(docker *)
  - Bash(podman *)
---

# Containerise

Target: $ARGUMENTS (empty means the whole repository).

## 1. Survey

Find the runtime and package manager from the lockfile: `pnpm-lock.yaml`, `package-lock.json`, `bun.lock`, `uv.lock`, `poetry.lock`, `requirements.txt`, `go.mod`, `Cargo.toml`, `pom.xml` / `build.gradle`. Note the start command, listening port, health endpoint, and the backing services the code connects to (database, cache, queue). Read any existing `Dockerfile`, `.dockerignore` or Compose file - you extend them rather than replace them.

Done when you can name the runtime, package manager, build command, start command, port and every backing service.

## 2. Scaffold

With no existing Dockerfile, write the files by hand from [references/patterns.md](references/patterns.md). `docker init` prompts interactively and the Bash tool has no terminal, so offer it to the user as an alternative they run themselves - it scaffolds `Dockerfile`, `.dockerignore`, `compose.yaml` and `README.Docker.md` for Node, Python, Go, Rust, Java, ASP.NET Core and PHP.

Done when the four files exist (or you have the hand-written equivalents open).

## 3. Write the Dockerfile

Read [references/patterns.md](references/patterns.md) for the runtime's pattern, then apply every rule:

- **Multi-stage**: a build stage with the toolchain; a runtime stage carrying only the built artefact and production dependencies.
- **Pinned base images**: look up the current tag on the image's registry page and pin it by digest (`image:tag@sha256:...`). Never `latest`. Get the digest with `docker buildx imagetools inspect image:tag`.
- **Minimal runtime**: distroless (`gcr.io/distroless/*-debian13`), Docker Hardened Images, or a `-slim` variant when the app needs a shell or system libraries.
- **BuildKit cache mounts** on every package-manager install (`RUN --mount=type=cache,target=...`), with the lockfile copied or bind-mounted before the source so dependency layers survive source edits.
- **Frozen installs**: `pnpm install --frozen-lockfile`, `npm ci`, `bun install --frozen-lockfile`, `uv sync --locked`.
- **Non-root numeric user**: `USER 65532:65532` on distroless, or create a user with a fixed UID/GID. Numeric IDs let Kubernetes `runAsNonRoot` verify it.
- **Exec-form `CMD`/`ENTRYPOINT`** so the process is PID 1 and receives SIGTERM.
- **`HEALTHCHECK`** against the health endpoint, using a binary the runtime image actually contains - distroless has no `curl`; see the healthcheck section of the patterns file.
- No secrets in `ENV`, `ARG` or layers; use `RUN --mount=type=secret` for build-time credentials.

Done when every rule above is either applied or has a one-line comment in the Dockerfile saying why not.

## 4. Write .dockerignore

Exclude VCS data, dependency folders (`node_modules`, `.venv`), build output, local env files (`.env*` but keep `.env.example` if the build needs it), test reports, editor folders and the Dockerfile and Compose files themselves.

Done when `docker build` reports a small context transfer and no secret file is inside it.

## 5. Write compose.yaml

Name it `compose.yaml` (the Compose preferred name) and leave out the top-level `version:` key - Compose ignores it. Add the backing services from step 1, each with a `healthcheck`, and make the app wait with `depends_on: { db: { condition: service_healthy } }`. Put credentials in an `env_file` or `secrets`, never inline. Use named volumes for data.

Done when `docker compose config` prints the merged file without errors or warnings.

## 6. Verify

```bash
docker build -t app:local .
docker compose up -d --wait
docker compose ps
docker run --rm --entrypoint id app:local   # skip on distroless; check with docker inspect -f '{{.Config.User}}'
```

Done when the build succeeds, `--wait` returns with every service healthy, the app answers on its port, and the runtime user is not 0. Report the final image size (`docker image ls app:local`) and anything left as a deliberate exception from step 3.
