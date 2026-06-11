"use strict";

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun,
  Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle,
  ShadingType, PageBreak, PageOrientation,
} = require("docx");
const fs = require("fs");
const path = require("path");

const SCREENSHOTS_DIR = path.join(__dirname, "..", "docs", "phase4", "screenshots");
const OUTPUT_PATH = path.join(__dirname, "..", "docs", "phase4", "phase4_report.docx");

// ─── helpers ───────────────────────────────────────────────────────────────

function img(filename, widthEmu = 580) {
  const file = path.join(SCREENSHOTS_DIR, filename);
  if (!fs.existsSync(file)) {
    console.warn(`  ⚠ Missing screenshot: ${filename}`);
    return null;
  }
  const data = fs.readFileSync(file);
  const heightEmu = Math.round(widthEmu * 0.56); // sensible default ratio
  return new ImageRun({
    data,
    transformation: { width: widthEmu, height: heightEmu },
    type: "png",
  });
}

function imgPara(filename, caption, widthEmu = 580) {
  const image = img(filename, widthEmu);
  const parts = [];
  if (image) {
    parts.push(new Paragraph({
      children: [image],
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 60 },
    }));
  }
  if (caption) {
    parts.push(new Paragraph({
      children: [new TextRun({ text: caption, italics: true, size: 18, color: "555555" })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }));
  }
  return parts;
}

function h1(text) {
  return new Paragraph({
    text, heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 120 },
    thematicBreak: false,
  });
}

function h2(text) {
  return new Paragraph({
    text, heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 100 },
  });
}

function h3(text) {
  return new Paragraph({
    text, heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 80 },
  });
}

function body(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })],
    spacing: { after: 100 },
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })],
    bullet: { level },
    spacing: { after: 60 },
  });
}

function code(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: "Courier New", size: 18, color: "1a1a1a" })],
    shading: { type: ShadingType.SOLID, color: "f0f0f0", fill: "f0f0f0" },
    spacing: { before: 60, after: 60 },
    indent: { left: 360 },
  });
}

function hr() {
  return new Paragraph({ thematicBreak: true, spacing: { before: 200, after: 200 } });
}

function tableRow(label, value) {
  const cellOpts = (txt) => new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text: txt, size: 20 })] })],
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
  });
  return new TableRow({ children: [cellOpts(label), cellOpts(value)] });
}

function simpleTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(([l, v]) => tableRow(l, v)),
    margins: { top: 60, bottom: 60 },
  });
}

// ─── document ──────────────────────────────────────────────────────────────

const children = [

  // ── Cover ──────────────────────────────────────────────────────────────
  new Paragraph({
    children: [new TextRun({ text: "Phase 4 Report", bold: true, size: 56, color: "1a56db" })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 800, after: 200 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "CI/CD Pipeline, Monitoring & Cost Management", size: 34, color: "374151" })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "Student Study Planner — AWS Capstone Project", italics: true, size: 26, color: "6b7280" })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "June 2026", size: 24, color: "9ca3af" })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 600 },
  }),
  new Paragraph({ children: [new PageBreak()] }),

  // ── Overview ───────────────────────────────────────────────────────────
  h1("Phase 4 Overview"),
  body("Challenge: Automate deployments and set up observability within Free Tier limits."),
  new Paragraph({ spacing: { after: 120 } }),

  h2("Activities Summary"),
  simpleTable([
    ["Activity", "Status"],
    ["Create GitHub Actions CI/CD workflow", "✅ Done"],
    ["Install Git on EC2 and clone repository", "✅ Done"],
    ["Set up SSH deploy script for EC2 + Nginx reload", "✅ Done"],
    ["Configure CloudWatch Alarms (CPU > 80%, ALB 5xx > 5%)", "✅ Done"],
    ["Install & configure CloudWatch Logs Agent (7-day retention)", "✅ Done"],
    ["Create AWS Budgets Free-Tier alert", "✅ Done"],
    ["Update Trello board", "⏳ Pending"],
    ["Peer code review via GitHub Pull Requests", "⏳ Pending"],
  ]),
  new Paragraph({ children: [new PageBreak()] }),

  // ── Task 1: GitHub Actions ─────────────────────────────────────────────
  h1("Task 1 — GitHub Actions CI/CD Workflow"),
  body("A GitHub Actions workflow was created at .github/workflows/deploy.yml to automatically deploy application code to the EC2 instance on every push to the main branch."),

  h2("Workflow File (deploy.yml)"),
  ...["name: Deploy to EC2", "", "on:", "  push:", "    branches:", "      - main", "",
    "jobs:", "  deploy:", "    runs-on: ubuntu-latest", "    steps:",
    "      - name: SSH into EC2 and deploy",
    "        uses: appleboy/ssh-action@v1.0.0",
    "        with:",
    "          host: ${{ secrets.EC2_HOST }}",
    "          username: ${{ secrets.EC2_USER }}",
    "          key: ${{ secrets.EC2_SSH_KEY }}",
    "          script: |",
    "            set -e",
    "            cd /home/ec2-user/aws-capstone-project",
    "            git pull origin main",
    "            sudo cp -r app/* /var/www/study-planner/",
    "            sudo chown -R nginx:nginx /var/www/study-planner",
    "            sudo nginx -t",
    "            sudo systemctl reload nginx",
    "            echo \"Deployment complete.\"",
  ].map(code),

  h2("deploy.yml on GitHub"),
  ...imgPara("deploy-yml-github.png", "Figure: deploy.yml file as viewed on GitHub.", 560),

  h2("GitHub Actions Workflow Runs"),
  ...imgPara("github-actions-tab.png", "Figure: GitHub Actions tab showing the workflow.", 560),
  ...imgPara("github-actions-runs.png", "Figure: List of workflow runs triggered by pushes to main.", 560),

  h2("GitHub Repository Secrets"),
  body("Three repository secrets are required for the workflow to SSH into EC2:"),
  simpleTable([
    ["Secret Name", "Description"],
    ["EC2_HOST", "EC2 Public IP — 3.237.34.20"],
    ["EC2_USER", "SSH username — ec2-user"],
    ["EC2_SSH_KEY", "Full contents of the SSH private key (.pem)"],
  ]),
  new Paragraph({ spacing: { after: 120 } }),
  ...imgPara("github-secrets.png", "Figure: EC2_HOST, EC2_USER, and EC2_SSH_KEY configured as Actions secrets.", 560),

  h2("Bugs Fixed in Original deploy.yml"),
  simpleTable([
    ["Bug", "Fix Applied"],
    ["on: and jobs: had 3 leading spaces — invalid YAML", "Fixed to column-0 alignment"],
    ["Deploy path 'your-app-folder' was a placeholder", "Changed to /home/ec2-user/aws-capstone-project"],
    ["npm install + pm2 restart — wrong for static Nginx site", "Replaced with cp, chown, nginx -t, systemctl reload"],
  ]),
  new Paragraph({ children: [new PageBreak()] }),

  // ── Task 2: Git & Clone ────────────────────────────────────────────────
  h1("Task 2 — Git Installation & Repository Clone on EC2"),
  body("Git was not pre-installed on the Amazon Linux 2023 instance. It was installed and the GitHub repository was cloned to enable git pull during CI/CD deployments."),

  h2("Commands Run on EC2"),
  ...["# Install Git", "sudo dnf install -y git", "git --version  # git version 2.50.1", "",
    "# Clone the repository",
    "git clone https://github.com/GeekKwame/aws-capstone-project.git \\",
    "  /home/ec2-user/aws-capstone-project",
  ].map(code),

  h2("Verification"),
  ...["--- Repo app files ---", "css  health.html  index.html  js", "",
    "--- Nginx web root ---", "css  health.html  index.html  js",
  ].map(code),
  body("Both directories match, confirming the deploy script will copy the correct files on future pushes."),
  new Paragraph({ children: [new PageBreak()] }),

  // ── Task 3: CloudWatch Alarms ──────────────────────────────────────────
  h1("Task 3 — CloudWatch Alarms"),
  body("CloudWatch Alarms were set up to monitor infrastructure health and alert the team via email when the EC2 instance is under heavy load or the ALB starts returning HTTP 5xx errors."),

  h2("1. EC2 CPU Utilization Alarm (EC2-High-CPU)"),
  simpleTable([
    ["Property", "Value"],
    ["Metric", "EC2 > Per-Instance Metrics > CPUUtilization"],
    ["Threshold", "Greater than 80%"],
    ["Evaluation Period", "3 consecutive periods of 5 minutes"],
    ["SNS Topic", "ec2-cpu-alert"],
    ["Alarm Name", "EC2-High-CPU"],
  ]),
  new Paragraph({ spacing: { after: 120 } }),

  h3("Configuration Steps"),
  bullet("Navigated to CloudWatch → Alarms → Create Alarm."),
  bullet("Clicked Select metric → EC2 → Per-Instance Metrics → selected CPUUtilization."),
  bullet("Set threshold type to Static, value to 80."),
  bullet("Set evaluation periods to 3 out of 3."),
  bullet("Created new SNS topic ec2-cpu-alert and subscribed the team email."),
  bullet("Clicked Create alarm and confirmed the email subscription."),

  h3("Screenshots"),
  ...imgPara("cloudwatch-alarm-1.png", "Figure: Selecting the CPUUtilization metric for the EC2 instance.", 560),
  ...imgPara("cloudwatch-alarm-2.png", "Figure: Setting the alarm threshold to >80% for 3 consecutive 5-min periods.", 560),
  ...imgPara("cloudwatch-alarm-3.png", "Figure: Configuring SNS email notifications.", 560),
  ...imgPara("cloudwatch-alarm-4.png", "Figure: EC2-High-CPU alarm created and listed in the CloudWatch dashboard.", 560),

  h2("2. ALB 5xx Error Rate Alarm (ALB-High-5XX)"),
  simpleTable([
    ["Property", "Value"],
    ["Metric", "ApplicationELB > Per AppELB Metrics"],
    ["Math Expression", "e1/m1*100 (HTTPCode_ELB_5XX_Count / RequestCount × 100)"],
    ["Threshold", "Greater than 5%"],
    ["SNS Topic", "ec2-cpu-alert (existing)"],
    ["Alarm Name", "ALB-High-5XX"],
  ]),
  new Paragraph({ spacing: { after: 120 } }),
  ...imgPara("elb-alarm.png", "Figure: Math expression alarm setup for calculating ALB 5xx error percentage.", 560),
  new Paragraph({ children: [new PageBreak()] }),

  // ── Task 4: CloudWatch Logs ────────────────────────────────────────────
  h1("Task 4 — CloudWatch Logs Agent"),
  body("The Amazon CloudWatch Logs Agent was installed and configured on the EC2 instance to stream Nginx logs to AWS CloudWatch with a 7-day retention policy."),

  h2("Installation"),
  ...["sudo yum install amazon-cloudwatch-agent -y"].map(code),
  ...imgPara("cloudwatch-agent-install.png", "Figure: CloudWatch Agent installed on EC2 (version 1.300066.2-2).", 560),

  h2("Configuration File"),
  body("Config file written to: /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json"),
  ...['{"logs":{"logs_collected":{"files":{"collect_list":[',
    '  {"file_path":"/var/log/nginx/access.log",',
    '   "log_group_name":"study-planner-nginx",',
    '   "log_stream_name":"{instance_id}",',
    '   "retention_in_days":7},',
    '  {"file_path":"/var/log/nginx/error.log",',
    '   "log_group_name":"study-planner-nginx-errors",',
    '   "log_stream_name":"{instance_id}",',
    '   "retention_in_days":7}',
    ']}}}}',
  ].map(code),
  ...imgPara("cloudwatch-agent-config.png", "Figure: Agent JSON config open in nano on EC2 — log paths, group, stream, and 7-day retention.", 560),

  h2("Starting the Agent"),
  ...["sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \\",
    "  -a fetch-config -m ec2 \\",
    "  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s",
  ].map(code),
  ...imgPara("cloudwatch-agent-started.png", "Figure: Configuration validation succeeded and CloudWatch Agent service started.", 560),

  h2("Summary"),
  simpleTable([
    ["Property", "Value"],
    ["Log Group (access)", "study-planner-nginx"],
    ["Log Group (errors)", "study-planner-nginx-errors"],
    ["Log Stream", "{instance_id} (auto-resolved per instance)"],
    ["Retention", "7 days"],
  ]),
  new Paragraph({ children: [new PageBreak()] }),

  // ── Task 5: AWS Budgets ────────────────────────────────────────────────
  h1("Task 5 — AWS Budgets"),
  body("An AWS Budget alert was created to monitor monthly spending and send an email notification the moment any cost above $0.01 is incurred, protecting the team from unexpected Free Tier overages."),

  h2("Configuration Steps"),
  bullet("Navigated to AWS Console → Billing → Budgets → Create budget."),
  bullet("Selected the Zero spend budget template (alerts on any spend above $0.01)."),
  bullet("Named the budget: Free-Tier-Monitor."),
  bullet("Added the team lead email address as a notification recipient."),
  bullet("Clicked Create budget."),
  new Paragraph({ spacing: { after: 120 } }),

  ...imgPara("aws-budget-create.png", "Figure: Zero spend budget template selected and named 'Free-Tier-Monitor'.", 560),
  ...imgPara("aws-budget-created.png", "Figure: Free-Tier-Monitor budget active — Status: Healthy, 0.00% used.", 560),

  h2("Budget Summary"),
  simpleTable([
    ["Property", "Value"],
    ["Budget Name", "Free-Tier-Monitor"],
    ["Budget Type", "Zero spend budget"],
    ["Alert Threshold", "Any spend > $0.01"],
    ["Notification", "Email to team lead"],
    ["Status", "Active & Healthy"],
  ]),

  hr(),

  // ── Footer ─────────────────────────────────────────────────────────────
  new Paragraph({
    children: [new TextRun({
      text: "Last updated: June 11, 2026 — Phase 4: CI/CD pipeline live, CloudWatch Alarms & Logs configured, AWS Budget active.",
      italics: true, size: 18, color: "6b7280",
    })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 300 },
  }),
];

// ─── build & write ─────────────────────────────────────────────────────────

const doc = new Document({
  creator: "AWS Capstone Team",
  title: "Phase 4 Report — CI/CD Pipeline, Monitoring & Cost Management",
  description: "Student Study Planner AWS Capstone Project — Phase 4 Documentation",
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 22 } },
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        run: { bold: true, size: 36, color: "1a56db", font: "Calibri" },
        paragraph: { spacing: { before: 400, after: 120 } },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        run: { bold: true, size: 28, color: "1e429f", font: "Calibri" },
        paragraph: { spacing: { before: 280, after: 80 } },
      },
      {
        id: "Heading3",
        name: "Heading 3",
        run: { bold: true, size: 24, color: "374151", font: "Calibri" },
        paragraph: { spacing: { before: 200, after: 60 } },
      },
    ],
  },
  sections: [{ children }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUTPUT_PATH, buffer);
  console.log(`✅ Report written to: ${OUTPUT_PATH}`);
}).catch((err) => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
