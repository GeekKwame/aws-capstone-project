/**
 * Generates the capstone final submission document (DOCX).
 * Run: node scripts/generate_final_report.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  ImageRun,
  AlignmentType,
  PageBreak,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ExternalHyperlink,
  TableOfContents,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
} = require('docx');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs', 'CAPSTONE_FINAL_REPORT.docx');

const LINKS = {
  repo: 'https://github.com/GeekKwame/aws-capstone-project',
  live: 'https://www.studentstudyplannerxyz.xyz/',
  liveApex: 'https://studentstudyplannerxyz.xyz/',
  demoVideo: 'https://drive.google.com/file/d/1DXGpDX82FUIWEva6sP-sFRv0VPGFDekr/view?usp=sharing',
  cloudfront: 'https://dk24845v6mvo0.cloudfront.net',
  alb: 'http://study-planner-alb-1113325153.us-east-1.elb.amazonaws.com',
};

const SCREENSHOTS = [
  { phase: 'Phase 1', file: 'docs/phase1/screenshots/image5.png', caption: 'Figure 1.1 — IAM users provisioned for the five-person team.' },
  { phase: 'Phase 1', file: 'docs/phase1/screenshots/image7.png', caption: 'Figure 1.2 — Least-privilege policies attached to CloudCapstoneTeam.' },
  { phase: 'Phase 1', file: 'docs/phase1/screenshots/image1.png', caption: 'Figure 1.3 — Capstone-WebServer EC2 instance running in us-east-1.' },
  { phase: 'Phase 1', file: 'docs/phase1/screenshots/cert-issued.png', caption: 'Figure 1.4 — ACM certificate issued for studentstudyplannerxyz.xyz.' },
  { phase: 'Phase 2', file: 'docs/phase2/screenshots/image8.png', caption: 'Figure 2.1 — Student Study Planner web application UI.' },
  { phase: 'Phase 2', file: 'docs/phase2/screenshots/alb-details.png', caption: 'Figure 2.2 — Application Load Balancer configuration.' },
  { phase: 'Phase 2', file: 'docs/phase2/screenshots/alb-healthy.png', caption: 'Figure 2.3 — Target group health checks passing on port 80.' },
  { phase: 'Phase 2', file: 'docs/phase2/screenshots/asg-details.png', caption: 'Figure 2.4 — Auto Scaling Group (capstone-web-asg) settings.' },
  { phase: 'Phase 2', file: 'docs/phase2/screenshots/static-assets-to-url.png', caption: 'Figure 2.5 — Static assets served from the S3 bucket.' },
  { phase: 'Phase 3', file: 'docs/phase3/image.png', caption: 'Figure 3.1 — ACM certificate issued for studentstudyplannerxyz.xyz, attached to CloudFront.' },
  { phase: 'Phase 4', file: 'docs/phase4/screenshots/deploy-yml-github.png', caption: 'Figure 4.1 — GitHub Actions deploy workflow in the repository.' },
  { phase: 'Phase 4', file: 'docs/phase4/screenshots/github-actions-runs.png', caption: 'Figure 4.2 — Successful CI/CD workflow runs on push to main.' },
  { phase: 'Phase 4', file: 'docs/phase4/screenshots/elb-alarm.png', caption: 'Figure 4.3 — CloudWatch alarm monitoring ALB 5xx error rate.' },
  { phase: 'Phase 4', file: 'docs/phase4/screenshots/aws-budget-created.png', caption: 'Figure 4.4 — AWS Budget alert configured for Free Tier spend.' },
  { phase: 'Phase 5', file: 'docs/phase5/architecture-diagram.png', caption: 'Figure 5.1 — End-to-end architecture (all five phases).' },
  { phase: 'Phase 5', file: 'docs/phase5/trello-board.png', caption: 'Figure 5.2 — Completed Trello board — all sprint cards in Done.' },
];

async function loadImage(file, maxWidth = 520) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) {
    console.warn(`Missing image: ${file}`);
    return null;
  }
  const meta = await sharp(full).metadata();
  const scale = Math.min(1, maxWidth / meta.width);
  const width = Math.round(meta.width * scale);
  const height = Math.round(meta.height * scale);
  const data = await sharp(full).resize(width, height).png().toBuffer();
  return { data, width, height };
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 160, before: opts.before ?? 0 },
    alignment: opts.align,
    children: [new TextRun({ text, size: opts.size ?? 22, bold: opts.bold, italics: opts.italics, font: 'Calibri' })],
  });
}

function linkPara(label, url) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({ text: `${label}: `, size: 22, font: 'Calibri' }),
      new ExternalHyperlink({
        children: [new TextRun({ text: url, style: 'Hyperlink', size: 22, font: 'Calibri' })],
        link: url,
      }),
    ],
  });
}

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 320, after: 200 }, children: [new TextRun({ text, font: 'Calibri' })] });
}

function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 160 }, children: [new TextRun({ text, font: 'Calibri' })] });
}

function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 180, after: 120 }, children: [new TextRun({ text, font: 'Calibri' })] });
}

function bullet(text) {
  return new Paragraph({
    spacing: { after: 80 },
    bullet: { level: 0 },
    children: [new TextRun({ text, size: 22, font: 'Calibri' })],
  });
}

async function figure(screenshot) {
  const img = await loadImage(screenshot.file);
  if (!img) {
    return [p(`[Screenshot unavailable: ${screenshot.file}]`, { italics: true })];
  }
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 80 },
      children: [new ImageRun({ data: img.data, transformation: { width: img.width, height: img.height }, type: 'png' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: screenshot.caption, size: 18, italics: true, font: 'Calibri', color: '555555' })],
    }),
  ];
}

function teamTable() {
  const header = new TableRow({
    children: ['Name', 'GitHub', 'AWS IAM User', 'Contribution'].map((t) =>
      new TableCell({
        width: { size: 25, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 20, font: 'Calibri' })] })],
      })
    ),
  });
  const rows = [
    ['Edmund (GeekKwame)', 'GeekKwame', 'Edmund', 'Repo owner, infrastructure lead, CI/CD'],
    ['Esther', '—', 'Esther', 'IAM setup, documentation'],
    ['Kwame Opoku', 'OwassJnr', 'Kwame', 'EC2 deployment, load balancer'],
    ['Priscilla', 'cilla-sys', 'Priscilla', 'S3 assets, CloudFront setup'],
    ['Winnifred', 'winnhans-devops', 'Winnifred', 'Monitoring, DNS go-live'],
  ].map(
    (r) =>
      new TableRow({
        children: r.map(
          (c) =>
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: c, size: 20, font: 'Calibri' })] })],
            })
        ),
      })
  );
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [header, ...rows],
  });
}

async function buildDocument() {
  const imageBlocks = {};
  for (const s of SCREENSHOTS) {
    if (!imageBlocks[s.phase]) imageBlocks[s.phase] = [];
    imageBlocks[s.phase].push(s);
  }

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 2400, after: 200 },
      children: [new TextRun({ text: 'AWS Cloud Capstone Project', bold: true, size: 52, font: 'Calibri' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [new TextRun({ text: 'Student Study Planner — Full Project Report', size: 32, font: 'Calibri' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [new TextRun({ text: 'Phases 1 through 5', size: 28, font: 'Calibri', color: '444444' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: 'CloudCapstoneTeam  |  June 2026', size: 24, font: 'Calibri', color: '666666' })],
    }),
    linkPara('GitHub Repository', LINKS.repo),
    linkPara('Live Application', LINKS.live),
    linkPara('Demo Video Recording', LINKS.demoVideo),
    new Paragraph({ children: [new PageBreak()] }),

    h1('Table of Contents'),
    new TableOfContents('Contents', { hyperlink: true, headingStyleRange: '1-3' }),
    new Paragraph({ children: [new PageBreak()] }),

    h1('1. Project Overview'),
    p(
      'This report documents the full build-out of Student Study Planner — a browser-based task manager we designed for students who need a lightweight way to organise study sessions across subjects. The app itself is plain HTML, CSS, and JavaScript with localStorage for persistence. No backend database was required, which kept our AWS footprint within Free Tier limits while still letting us demonstrate a realistic production architecture.'
    ),
    p(
      'What makes this project more than a static website is the infrastructure underneath it. Over five phases we provisioned IAM identities, stood up EC2 behind an Application Load Balancer, offloaded static assets to S3, fronted everything with CloudFront and a custom domain, wired up GitHub Actions for push-to-deploy CI/CD, and added CloudWatch monitoring with budget alerts. The result is a publicly accessible HTTPS site at www.studentstudyplannerxyz.xyz backed by a version-controlled GitHub repository.'
    ),

    h2('Key Links'),
    linkPara('Source code (GitHub)', LINKS.repo),
    linkPara('Production URL', LINKS.live),
    linkPara('Demo video (Google Drive)', LINKS.demoVideo),
    linkPara('CloudFront distribution', LINKS.cloudfront),

    h2('Team'),
    teamTable(),

    h1('2. Phase 1 — Project Setup & Environment'),
    p(
      'Phase 1 was about getting the fundamentals right before touching production traffic. We created five IAM users (Edmund, Esther, Kwame, Priscilla, Winnifred) under a shared CloudCapstoneTeam group and deliberately avoided AdministratorAccess. Instead we attached six scoped policies: EC2, S3, ACM, CloudFront, Elastic Load Balancing, and IAM Read-only. That gave everyone enough access to work independently without any single compromised key taking down the whole account.'
    ),
    p(
      'Locally, each developer installed AWS CLI v2 and Git, then configured a named profile (cloud-project) pointed at their own access keys. We verified identity with aws sts get-caller-identity before running any infrastructure commands. On the collaboration side we set up the GitHub repository with a main / develop / feature/* branching model, invited all collaborators, and created a Trello board with Backlog, In Progress, Review, and Done columns to track sprint work.'
    ),
    p(
      'Infrastructure provisioning in this phase included launching Capstone-WebServer (a t3.micro in us-east-1), opening security group ports 80 and 443, creating the S3 bucket capstone-static-assets-azubi-610356897914-us-east-1-an, and requesting an ACM public certificate for studentstudyplannerxyz.xyz via DNS validation. The certificate sat in Issued status by the end of Phase 1, ready for CloudFront in Phase 3.'
    ),
    ...(await figure(imageBlocks['Phase 1'][0])),
    ...(await figure(imageBlocks['Phase 1'][1])),
    ...(await figure(imageBlocks['Phase 1'][2])),
    ...(await figure(imageBlocks['Phase 1'][3])),

    h1('3. Phase 2 — Web Application & EC2 Deployment'),
    p(
      'With the environment ready, Phase 2 focused on the actual product and getting it onto a web server. We built Student Study Planner in the app/ directory: index.html for the UI, styles.css with light/dark theme support, app.js for task CRUD and localStorage, config.js pointing at the S3 logo URL, and health.html returning a plain OK response for load balancer probes.'
    ),
    p(
      'Deployment followed a manual-first approach. We SSHed into Capstone-WebServer, installed Nginx on Amazon Linux 2023, copied the app files into /var/www/study-planner, and wrote a site block at /etc/nginx/conf.d/study-planner.conf. Ownership was set to nginx:nginx. Once the single instance served the app correctly over HTTP, we moved to high availability.'
    ),
    p(
      'An Application Load Balancer (study-planner-alb) was created with an HTTP :80 listener forwarding to the capstone-web-tg target group. Health checks hit /health.html and expect a 200. We registered Capstone-WebServer and confirmed Healthy status before testing the ALB DNS name in a browser.'
    ),
    p(
      'Static assets — primarily the Azubi.png logo — were synced to S3 and referenced from config.js so the browser loads them directly from the bucket URL. Finally, we created a custom AMI (Capstone-WebServer-AMI), a launch template (capstone-web-lt), and an Auto Scaling Group (capstone-web-asg) scaled between 1 and 3 t3.micro instances. New instances auto-register with the target group.'
    ),
    ...(await figure(imageBlocks['Phase 2'][0])),
    ...(await figure(imageBlocks['Phase 2'][1])),
    ...(await figure(imageBlocks['Phase 2'][2])),
    ...(await figure(imageBlocks['Phase 2'][3])),
    ...(await figure(imageBlocks['Phase 2'][4])),

    h1('4. Phase 3 — CloudFront CDN & HTTPS'),
    p(
      'Serving over plain HTTP on an ALB DNS name works for testing, but it is not what you ship to users. Phase 3 put CloudFront in front of the ALB and tied it to our custom domain. The distribution origin points at study-planner-alb-1113325153.us-east-1.elb.amazonaws.com, with viewer protocol policy set to Redirect HTTP to HTTPS so no one hits the site insecurely.'
    ),
    p(
      'We attached the ACM certificate from Phase 1 (must live in us-east-1 for CloudFront) and added studentstudyplannerxyz.xyz and www.studentstudyplannerxyz.xyz as alternate domain names. DNS at Namecheap routes the apex via an ALIAS record and www via CNAME, both targeting dk24845v6mvo0.cloudfront.net.'
    ),
    p(
      'Getting this working was not plug-and-play. Our first CloudFront-to-ALB connection returned 502 errors because the origin protocol policy did not match the ALB listener — CloudFront was trying HTTPS against an HTTP-only listener. Once we aligned those settings, the custom domain came up cleanly with the padlock icon in the browser.'
    ),
    ...(await figure(imageBlocks['Phase 3'][0])),

    h1('5. Phase 4 — CI/CD, Monitoring & Go-Live'),
    p(
      'Manual SCP deploys do not scale with a team of five. Phase 4 automated the release path. We added .github/workflows/deploy.yml, which triggers on every push to main. GitHub Actions SSHes into EC2 using secrets (EC2_HOST, EC2_USER, EC2_SSH_KEY), pulls the latest code from /home/ec2-user/aws-capstone-project, copies app/* into the Nginx web root, validates the config with nginx -t, and reloads Nginx. Typical deploy time is under 30 seconds.'
    ),
    p(
      'The first workflow runs exposed real bugs: YAML indentation on on: and jobs: caused parse failures, and an early template assumed Node.js with npm install and pm2 — wrong for a static Nginx site. We also had to install Git on Amazon Linux 2023 manually before git pull would work on the instance.'
    ),
    p(
      'For observability we configured two CloudWatch alarms — EC2-High-CPU (>80% for 15 minutes) and ALB-High-5XX (>5% error rate) — both publishing to SNS email topics. The CloudWatch agent streams Nginx access and error logs to log groups with 7-day retention. An AWS Budget named Free-Tier-Monitor emails us if spend exceeds $0.01, which is aggressive but appropriate for a student capstone.'
    ),
    p(
      'DNS go-live was the milestone that made everything feel real. After confirming alternate domain names on the CloudFront distribution, we pointed Namecheap DNS at the distribution and verified both apex and www URLs returned 200 over HTTPS.'
    ),
    ...(await figure(imageBlocks['Phase 4'][0])),
    ...(await figure(imageBlocks['Phase 4'][1])),
    ...(await figure(imageBlocks['Phase 4'][2])),
    ...(await figure(imageBlocks['Phase 4'][3])),

    h1('6. Phase 5 — Presentation, Review & Final Delivery'),
    p(
      'The final phase pulled everything together for submission. We recorded a walkthrough demo (link below), prepared presentation slides, captured the completed Trello board showing every card in Done, and produced this consolidated report. The live demo script covers adding a task, marking it complete, filtering by status, toggling dark mode, and inspecting CloudFront response headers in DevTools.'
    ),
    linkPara('Recorded demo video', LINKS.demoVideo),
    p(
      'We also ran a peer code review through GitHub Pull Requests before promoting changes to main, and fixed a late-stage codebase mismatch where the repository still contained an old MyCloudApp landing-page template in JavaScript and CSS while the HTML had already been updated to Student Study Planner. That desync caused quotes and task management to fail on some requests when multiple EC2 instances served different file versions. We resolved it by aligning all app files in the repo, improving the deploy script to invalidate CloudFront cache, and ensuring only the updated instance served ALB traffic.'
    ),
    ...(await figure(imageBlocks['Phase 5'][0])),
    ...(await figure(imageBlocks['Phase 5'][1])),

    h1('7. Security Summary'),
    p('A few decisions worth calling out explicitly:'),
    bullet('No AdministratorAccess on any IAM user — scoped policies only.'),
    bullet('SSH key authentication on EC2; port 22 not open to the public internet.'),
    bullet('GitHub Actions secrets for deploy credentials; nothing committed to the repo.'),
    bullet('HTTPS enforced at CloudFront with ACM-managed TLS; certificate auto-renews.'),
    bullet('S3 bucket holds only public static assets (logo); application state stays in browser localStorage.'),

    h1('8. Challenges & How We Resolved Them'),
    p('These are the blockers that cost us the most time:'),
    bullet('GitHub Actions YAML indentation — three leading spaces on on: and jobs: broke parsing. Fixed by aligning top-level keys to column 0.'),
    bullet('Deploy script assumed Node.js — replaced npm/pm2 commands with git pull, cp, chown, nginx -t, and systemctl reload nginx.'),
    bullet('CloudFront 502 Bad Gateway — origin protocol mismatch between CloudFront (HTTPS Only) and ALB (HTTP :80). Aligned policies.'),
    bullet('Apex domain not resolving — Namecheap needed an ALIAS record for @, not a CNAME. Added via Advanced DNS.'),
    bullet('ACM pending validation — DNS CNAME from ACM was missing at the registrar. Added, certificate issued within minutes.'),
    bullet('Git missing on EC2 — sudo dnf install -y git, then cloned the repo for CI/CD pulls.'),
    bullet('Codebase drift across instances — old MyCloudApp JS on some EC2 targets while HTML was updated. Fixed repo contents, deploy script, and ALB target registration.'),

    h1('9. Lessons Learned'),
    p(
      'The layered architecture (CloudFront → ALB → EC2) paid off. We could tune caching, scaling, and compute independently. ACM removed the headache of manual certificate renewal. Once the deploy.yml bugs were fixed, push-to-deploy became genuinely useful — merge to main and the site updates before you finish refreshing the browser.'
    ),
    p(
      'If we rebuilt this today, we would provision infrastructure with CloudFormation or Terraform instead of console clicks, store secrets in AWS Secrets Manager rather than flat GitHub secrets, and add a proper database (RDS or DynamoDB) instead of localStorage-only persistence. Load testing with k6 would also be on the list — we never stress-tested the ASG scale-out behaviour.'
    ),

    h1('10. Resource Reference'),
    h3('AWS Resources'),
    bullet('Account ID: 610356897914'),
    bullet('Region: us-east-1 (N. Virginia)'),
    bullet('EC2: Capstone-WebServer (i-039e2bea39a5ec163), t3.micro'),
    bullet('ALB: study-planner-alb-1113325153.us-east-1.elb.amazonaws.com'),
    bullet('Target Group: capstone-web-tg'),
    bullet('ASG: capstone-web-asg (min 1, max 3)'),
    bullet('S3: capstone-static-assets-azubi-610356897914-us-east-1-an'),
    bullet('CloudFront: dk24845v6mvo0.cloudfront.net (E17IY3DHLJ70BV)'),
    bullet('Domain: studentstudyplannerxyz.xyz'),

    h3('Repository Structure'),
    bullet('app/ — Student Study Planner frontend'),
    bullet('.github/workflows/deploy.yml — CI/CD pipeline'),
    bullet('nginx/study-planner.conf — Nginx site template'),
    bullet('docs/phase1–5/ — Phase documentation and screenshots'),
    bullet('scripts/deploy-ec2.sh — EC2 deployment and CloudFront invalidation'),

    h3('External Links'),
    linkPara('GitHub repository', LINKS.repo),
    linkPara('Live site (www)', LINKS.live),
    linkPara('Live site (apex)', LINKS.liveApex),
    linkPara('Demo video recording', LINKS.demoVideo),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 600 },
      children: [
        new TextRun({
          text: '— End of Report —',
          size: 22,
          italics: true,
          font: 'Calibri',
          color: '888888',
        }),
      ],
    }),
  ];

  return new Document({
    styles: {
      default: { document: { run: { font: 'Calibri', size: 22 } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 32, bold: true, font: 'Calibri', color: '1F3864' },
          paragraph: { spacing: { before: 320, after: 200 }, outlineLevel: 0 } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 28, bold: true, font: 'Calibri', color: '2E5496' },
          paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 } },
        { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 24, bold: true, font: 'Calibri', color: '404040' },
          paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 2 } },
      ],
    },
    sections: [
      {
        properties: {
          page: { margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 } },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: 'AWS Capstone — Student Study Planner', size: 16, color: '999999', font: 'Calibri' })],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'Page ', size: 18, font: 'Calibri', color: '888888' }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 18, font: 'Calibri', color: '888888' }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });
}

async function main() {
  console.log('Building capstone final report...');
  const doc = await buildDocument();
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUT, buffer);
  console.log(`Written: ${OUT}`);
  console.log(`Size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
