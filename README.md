# Student Study Planner — AWS Capstone Project

**Student Study Planner** (deployed as **MyCloudApp**) is an interactive, responsive web application designed to help students organize academic workflows, manage schedules, and stay productive. It provides comprehensive task tracking (CRUD), session categorization, local progress state persistence, and interactive motivation features.

This repository documents the full design, provisioning, deployment, and security hardening of the application's production infrastructure on AWS. The system utilizes a load-balanced, auto-scaling architecture fronted by a global content delivery network (CDN).

**Repository:** [GeekKwame/aws-capstone-project](https://github.com/GeekKwame/aws-capstone-project)

---

## Project Overview

The **Student Study Planner** is deployed on AWS using a highly resilient, public-facing architecture. By separating static asset delivery (served from Amazon S3 via Amazon CloudFront Edge locations with Origin Access Control) from dynamic web content (served via Nginx on Amazon EC2 instances behind an Application Load Balancer), the application achieves exceptional responsiveness, security, and high availability.

| Phase | Focus | Status |
|-------|-------|--------|
| [Phase 1](docs/phase1/README.md) | Project setup, IAM, CLI, GitHub, EC2, S3 | ✅ Complete |
| [Phase 2](docs/phase2/README.md) | Web app deployment, ALB, S3 static assets, Auto Scaling, ACM | ✅ Complete |
| [Phase 3](docs/phase3/README.md) | CloudFront CDN, HTTPS enforcement, custom domain via studentstudyplannerxyz.xyz | ✅ Complete |

---

## Architecture

```
Users → studentstudyplannerxyz.xyz
          ↓
    Application Load Balancer (study-planner-alb)
          ↓
    Auto Scaling Group (capstone-web-asg)
    ├── EC2: Capstone-WebServer (Nginx, Amazon Linux 2023)
    └── EC2: ASG clone instance(s)
          ↓
    S3 Bucket (static assets — logo, images)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Web Server | Nginx on Amazon Linux 2023 |
| Compute | AWS EC2 `t3.micro` (Free Tier) |
| Static Assets | AWS S3 |
| Load Balancing | AWS Application Load Balancer |
| Scaling | AWS Auto Scaling Group |
| TLS/SSL | AWS Certificate Manager (ACM) |
| Version Control | GitHub |
| Project Management | Trello |

---

## Team

| Name | GitHub | AWS IAM User |
|------|--------|--------------|
| Edmund (GeekKwame) | [GeekKwame](https://github.com/GeekKwame) | Edmund |
| Esther | — | Esther |
| Kwame Opoku | [OwassJnr](https://github.com/OwassJnr) | Kwame |
| Priscilla | [cilla-sys](https://github.com/cilla-sys) | Priscilla |
| Winnifred | [winnhans-devops](https://github.com/winnhans-devops) | Winnifred |

All IAM users belong to the **CloudCapstoneTeam** group with least-privilege policies.

---

## Quick Start (New Team Member)

1. **Accept** the GitHub collaborator invitation for [aws-capstone-project](https://github.com/GeekKwame/aws-capstone-project).

2. **Clone** the repository and check out `develop`:
   ```bash
   git clone https://github.com/GeekKwame/aws-capstone-project.git
   cd aws-capstone-project
   git checkout develop
   ```

3. **Install** prerequisites:
   - [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
   - [Git](https://git-scm.com/downloads)

4. **Configure** your named AWS profile with the access keys provided by your team lead:
   ```bash
   aws configure --profile cloud-project
   ```

5. **Verify** your identity:
   ```bash
   aws sts get-caller-identity --profile cloud-project
   ```

6. **Join** the Trello board and pull the next task from **Backlog**.

> **Security note:** Never commit access keys or secret keys to version control. Store credentials only in local AWS config files or a secrets manager.

---

## Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code (default branch) |
| `develop` | Team integration branch |
| `feature/*` | Isolated task development |

**Workflow:** `feature/*` → Pull Request → `develop` → promote to `main` when stable.

---

## Repository Structure

```
aws-capstone-project/
├── app/                  # Student Study Planner web application
│   ├── index.html        # Main UI
│   ├── health.html       # Load balancer health check endpoint
│   ├── css/styles.css    # Styles (light/dark theme, responsive)
│   └── js/
│       ├── app.js        # Task CRUD, filtering, localStorage
│       ├── config.js     # S3 asset URLs and app config
│       └── config.example.js # Config template for deployment setup
├── docs/
│   ├── phase1/           # Phase 1 documentation & screenshots
│   │   └── README.md
│   ├── phase2/           # Phase 2 documentation & screenshots
│   │   └── README.md
│   └── phase3/           # Phase 3 documentation & screenshots
│       └── README.md
├── nginx/
│   └── study-planner.conf # Nginx configuration template for EC2
├── scripts/
│   └── generate_phase2_docx.js # Documentation compiler script
└── README.md             # This file
```

---

## Phase Documentation

| Document | Contents |
|----------|----------|
| [docs/phase1/README.md](docs/phase1/README.md) | IAM setup, AWS CLI, GitHub repo, Trello, EC2, S3, ACM certificate request |
| [docs/phase2/README.md](docs/phase2/README.md) | Web app deployment, Nginx, ALB, target groups, S3 static assets, Auto Scaling |
| [docs/phase3/README.md](docs/phase3/README.md) | CloudFront CDN, HTTPS enforcement, Custom Domain configuration, OAC setup |

---

## Next Steps

- Configure CloudFront CDN distribution in front of the ALB
- Enable HTTPS with the ACM certificate on CloudFront and the ALB listener
- Configure custom domain routing via studentstudyplannerxyz.xyz → CloudFront
- Automate infrastructure with IaC — CloudFormation or Terraform (future phases)

---

*Last updated: June 10, 2026 — Phase 1 & 2 complete.*
