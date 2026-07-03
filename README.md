# 📄 Word to PDF Converter

[![Deploy to EC2](https://github.com/mihisara-koralage/word-to-pdf-converter/actions/workflows/deploy.yml/badge.svg)](https://github.com/mihisara-koralage/word-to-pdf-converter/actions/workflows/deploy.yml)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-Automated%20Push-2496ED?logo=docker&logoColor=white)](https://hub.docker.com/)
[![AWS EC2](https://img.shields.io/badge/AWS-EC2-FF9900?logo=amazonaws&logoColor=white)](https://aws.amazon.com/ec2/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

A containerized DOCX → PDF conversion service, built primarily as an exercise in **CI/CD automation and cloud deployment**: every push to `main` is built, containerized, pushed to Docker Hub, and rolled out to a live AWS EC2 instance with zero manual steps. The application layer (Node.js/Express + LibreOffice) exists to give the pipeline something real to ship.

---

## 🎯 Project Focus: DevOps, Not Just the App

This repo is less "how do I convert a file" and more "how do I take a working app from a laptop to a monitored, reproducible, automatically-deployed service." The things intentionally emphasized:

- **One environment, everywhere** — Docker Compose guarantees the same runtime locally, in CI, and on EC2
- **No manual deploys** — GitHub Actions owns the entire build → publish → release path
- **Immutable, versioned artifacts** — every deploy is a specific Docker Hub image tag, not a `git pull` on the server
- **Security as infrastructure, not an afterthought** — rate limiting, header hardening, and input validation live at the edge of the container, not scattered in app logic

## 🏗️ Infrastructure Architecture

**Runtime / Request Flow**

```
Browser
   │  HTTPS upload (DOCX)
   ▼
Express App  (Docker container)
   │  validate • rate-limit • sanitize
   ▼
LibreOffice  (headless, same container/image)
   │  DOCX → PDF conversion
   ▼
Generated PDF
   │
   ▼
Browser (download)
```

**Deployment Pipeline**

```
Developer push → GitHub (main branch)
   │
   ▼
GitHub Actions
   ├─ install deps & run tests
   ├─ build Docker image
   └─ tag & push image
   │
   ▼
Docker Hub  (image registry)
   │
   ▼
AWS EC2
   ├─ pull latest image
   ├─ recreate container (docker compose)
   └─ health check
```
**Architecture Diagram**

```
                    Developer
                        │
                 git push to GitHub
                        │
                        ▼
               GitHub Repository
                        │
                        ▼
              GitHub Actions (CI/CD)
          ┌─────────────┴─────────────┐
          │                           │
          ▼                           ▼
Build Docker Image             SSH into EC2
          │                           │
          ▼                           │
Docker Hub Registry                   │
          │                           │
          └─────────────┬─────────────┘
                        ▼
               docker compose pull
                        │
                        ▼
                  Docker Container
                        │
                        ▼
             Word-to-PDF Converter
                        │
                        ▼
                 LibreOffice Engine
                        │
                        ▼
                  Generated PDF
                        │
                        ▼
                     Browser
```


**Why this shape:** the registry (Docker Hub) decouples *build* from *deploy* — EC2 never builds anything, it only pulls a known-good, already-tested image. That keeps the production host's attack surface and toolchain minimal, and makes rollback as simple as pulling a previous tag.

## ⚙️ CI/CD Pipeline Breakdown

| Stage | Tool | What happens |
|---|---|---|
| **Trigger** | GitHub Actions | Runs on every push to `main` |
| **Build & Test** | GitHub Actions | Installs dependencies, runs test suite |
| **Package** | Docker | Builds the application image (Node.js + LibreOffice baked in) |
| **Publish** | Docker Hub | Pushes the tagged image to the registry |
| **Deploy** | AWS EC2 | Pulls the new image and restarts the service via Docker Compose |

Goals of this design: **fast feedback** (tests fail the pipeline before anything ships), **reproducibility** (the image that passed CI is the exact image that runs in prod), and **minimal deploy surface** (EC2's only job is `docker pull` + `docker compose up`).

## 🐳 Containerization

- Fully defined via `Dockerfile` + `docker-compose.yml` — no undocumented host dependencies
- LibreOffice (the heaviest dependency) is baked into the image, so "works in Docker" == "works in prod"
- `docker compose up -d` reproduces the full stack — app + conversion engine — with a single command, locally or on the server

## 🔒 Security & Hardening

Treated as part of the infrastructure, not just application code:

- **Helmet** — secure-by-default HTTP headers
- **Rate limiting** — throttles abusive/high-volume request patterns
- **Request logging** — every request is traceable for auditing/debugging
- **Strict DOCX validation** — rejects anything outside the expected MIME/type
- **Upload size limits** — caps payloads to prevent resource exhaustion
- **Filename sanitization** — prevents path traversal on generated files
- **Centralized error handling** — no unhandled exceptions leaking stack traces

## 🛠️ Tech Stack

| Layer | Tools |
|---|---|
| **Application** | Node.js, Express |
| **Conversion Engine** | LibreOffice (headless) |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |
| **Registry** | Docker Hub |
| **Cloud Hosting** | AWS EC2 |

## 📦 Running It

### Locally (no containers)

```bash
git clone https://github.com/mihisara-koralage/word-to-pdf-converter.git
cd word-to-pdf-converter
npm install
npm start
```

### Locally (containerized — mirrors production)

```bash
docker compose up -d
```

This is the recommended path: it's the exact same image and startup sequence used on EC2, so "works on my machine" carries over to prod.

## 📌 DevOps Roadmap

Next steps, in priority order for hardening this into a more production-grade pipeline:

- [ ] Add centralized logging/metrics (e.g., structured logs → CloudWatch or a self-hosted stack)
- [ ] Add a staging environment/branch before promoting to `main`
- [ ] Blue/green or rolling deploy on EC2 instead of full container restart
- [ ] Infrastructure as Code (Terraform) for the EC2 host instead of manual provisioning
- [ ] Automated rollback on failed health check post-deploy
- [ ] Horizontal scaling behind a load balancer for concurrent conversions

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 👤 Author

**Mihisara Koralage**
GitHub: [@mihisara-koralage](https://github.com/mihisara-koralage)