const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

async function main() {
  console.log('Generating PowerPoint presentation slides (10x5.625 coordinate layout)...');
  const pptx = new PptxGenJS();
  
  // Slide settings (16:9 widescreen)
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Edmund (GeekKwame)';
  pptx.company = 'Azubi Africa DevOps Capstone Team';
  pptx.title = 'Student Study Planner AWS Capstone Presentation';

  // Define color constants (without #)
  const COLORS = {
    NAVY: '1E3A8A',
    SKY: '0EA5E9',
    SLATE_DARK: '0F172A',
    TEXT: '334155',
    TEXT_HEADING: '0F172A',
    BORDER: 'E2E8F0',
    LIGHT_BG: 'F8FAFC',
    WHITE: 'FFFFFF',
    RED_BG: 'FEF2F2',
    RED_BORDER: 'FCA5A5',
    RED_TEXT: '991B1B',
    GREEN_BG: 'F0FDF4',
    GREEN_BORDER: '86EFAC',
    GREEN_TEXT: '166534',
    BLUE_LIGHT: 'EFF6FF',
    SLATE_LIGHT: 'F1F5F9',
    SLATE_CARD: '1E293B'
  };

  // Helper: Create a light slide template with title, bar, and footer
  function createLightSlide(title) {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.WHITE };
    
    // Add Slide Title
    slide.addText(title, {
      x: 0.8,
      y: 0.4,
      w: 8.4,
      h: 0.6,
      fontFace: 'Segoe UI',
      fontSize: 24,
      color: COLORS.NAVY,
      bold: true,
      valign: 'middle'
    });
    
    // Add decorative accent line below title
    slide.addShape('rect', {
      x: 0.8,
      y: 1.0,
      w: 1.5,
      h: 0.04,
      fill: { color: COLORS.SKY },
      line: { width: 0 }
    });
    
    // Add slide footer
    slide.addText('AWS DevOps Capstone Project  |  Student Study Planner', {
      x: 0.8,
      y: 5.15,
      w: 7.0,
      h: 0.3,
      fontFace: 'Segoe UI',
      fontSize: 8.5,
      color: '94A3B8'
    });
    
    // Page number (automatic)
    slide.addText('{slide_num} / {slide_num}', {
      x: 8.2,
      y: 5.15,
      w: 1.0,
      h: 0.3,
      fontFace: 'Segoe UI',
      fontSize: 8.5,
      color: '94A3B8',
      align: 'right'
    });

    return slide;
  }

  // ==========================================
  // Slide 1: Title Slide (Dark Theme)
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.SLATE_DARK };
    
    // Add Title
    slide.addText('STUDENT STUDY PLANNER', {
      x: 0.5,
      y: 1.1,
      w: 9.0,
      h: 0.7,
      fontFace: 'Segoe UI',
      fontSize: 32,
      color: COLORS.SKY,
      bold: true,
      align: 'center'
    });
    
    // Add Subtitle
    slide.addText('AWS Cloud Infrastructure & CI/CD Deployment Showcase', {
      x: 0.5,
      y: 1.8,
      w: 9.0,
      h: 0.5,
      fontFace: 'Segoe UI',
      fontSize: 16,
      color: COLORS.WHITE,
      align: 'center'
    });

    slide.addText('DevOps Capstone Project Presentation — Phase 5', {
      x: 0.5,
      y: 2.3,
      w: 9.0,
      h: 0.3,
      fontFace: 'Segoe UI',
      fontSize: 11,
      color: '94A3B8',
      italic: true,
      align: 'center'
    });

    // Team members heading
    slide.addText('Azubi Africa Capstone Team:', {
      x: 0.5,
      y: 3.1,
      w: 9.0,
      h: 0.3,
      fontFace: 'Segoe UI',
      fontSize: 10,
      color: '94A3B8',
      bold: true,
      align: 'center'
    });

    // Team members row (5 members)
    const members = [
      { name: 'Edmund (GeekKwame)', role: 'Infrastructure Lead' },
      { name: 'Kwame Opoku', role: 'DevOps Engineer' },
      { name: 'Priscilla', role: 'DevOps Engineer' },
      { name: 'Winnifred', role: 'DevOps Engineer' },
      { name: 'Esther', role: 'DevOps Engineer' }
    ];

    const boxW = 1.6;
    const boxH = 0.95;
    const gap = 0.15;
    const startX = (10.0 - (5 * boxW + 4 * gap)) / 2;

    members.forEach((m, idx) => {
      const x = startX + idx * (boxW + gap);
      
      // Box background
      slide.addShape('rect', {
        x: x,
        y: 3.5,
        w: boxW,
        h: boxH,
        fill: { color: COLORS.SLATE_CARD },
        line: { color: '334155', width: 1 }
      });
      
      // Name
      slide.addText(m.name, {
        x: x,
        y: 3.55,
        w: boxW,
        h: 0.35,
        fontFace: 'Segoe UI',
        fontSize: 9,
        color: COLORS.WHITE,
        bold: true,
        align: 'center'
      });
      
      // Role
      slide.addText(m.role, {
        x: x,
        y: 3.95,
        w: boxW,
        h: 0.35,
        fontFace: 'Segoe UI',
        fontSize: 8,
        color: COLORS.SKY,
        align: 'center'
      });
    });
  }

  // ==========================================
  // Slide 2: Problem & Solution Overview (Light Theme)
  // ==========================================
  {
    const slide = createLightSlide('Problem & Solution Overview');
    
    // Left column: Problem
    slide.addShape('rect', {
      x: 0.8,
      y: 1.3,
      w: 4.0,
      h: 3.6,
      fill: { color: COLORS.RED_BG },
      line: { color: COLORS.RED_BORDER, width: 1 }
    });
    
    slide.addText('THE ACADEMIC PROBLEM', {
      x: 1.0,
      y: 1.45,
      w: 3.6,
      h: 0.3,
      fontFace: 'Segoe UI',
      fontSize: 14,
      color: COLORS.RED_TEXT,
      bold: true
    });

    const problemPoints = [
      'Academic Overload: Students juggle multiple courses, assignments, and study tasks without structured pathways.',
      'Generic Tool Deficit: Existing general-purpose productivity apps lack academic context (priorities, subject tags).',
      'High Friction & Loss: Paper planners are easily lost; heavyweight digital tools have steep learning curves.'
    ];

    problemPoints.forEach((p, idx) => {
      // Small custom red bullet icon
      slide.addShape('rect', {
        x: 1.0,
        y: 1.95 + idx * 0.95,
        w: 0.08,
        h: 0.08,
        fill: { color: COLORS.RED_TEXT },
        line: { width: 0 }
      });
      
      slide.addText(p, {
        x: 1.15,
        y: 1.85 + idx * 0.95,
        w: 3.45,
        h: 0.85,
        fontFace: 'Segoe UI',
        fontSize: 10.5,
        color: COLORS.TEXT
      });
    });

    // Right column: Solution
    slide.addShape('rect', {
      x: 5.2,
      y: 1.3,
      w: 4.0,
      h: 3.6,
      fill: { color: COLORS.GREEN_BG },
      line: { color: COLORS.GREEN_BORDER, width: 1 }
    });

    slide.addText('OUR PURPOSE-BUILT SOLUTION', {
      x: 5.4,
      y: 1.45,
      w: 3.6,
      h: 0.3,
      fontFace: 'Segoe UI',
      fontSize: 14,
      color: COLORS.GREEN_TEXT,
      bold: true
    });

    const solutionPoints = [
      'Frictionless Task Management: Create tasks with key academic metadata (subjects, custom priorities, due dates).',
      'Motivating Feedback Loop: Dynamic progress bars track completions; randomized motivational quotes refresh on load.',
      'Resilient Client State: Client-side storage (localStorage) allows full offline usage with zero load latency.'
    ];

    solutionPoints.forEach((p, idx) => {
      // Small custom green bullet icon
      slide.addShape('rect', {
        x: 5.4,
        y: 1.95 + idx * 0.95,
        w: 0.08,
        h: 0.08,
        fill: { color: COLORS.GREEN_TEXT },
        line: { width: 0 }
      });

      slide.addText(p, {
        x: 5.55,
        y: 1.85 + idx * 0.95,
        w: 3.45,
        h: 0.85,
        fontFace: 'Segoe UI',
        fontSize: 10.5,
        color: COLORS.TEXT
      });
    });
  }

  // ==========================================
  // Slide 3: Traffic Flow Walkthrough (Light Theme)
  // ==========================================
  {
    const slide = createLightSlide('Traffic Flow: Client to Web Origin');
    
    const steps = [
      {
        num: '1',
        title: 'DNS & Edge',
        desc: 'Namecheap DNS routes apex and www requests. CloudFront CDN serves cached static assets globally at 400+ Edge locations, reducing latency.'
      },
      {
        num: '2',
        title: 'Load Balancing',
        desc: 'CloudFront forwards cache misses to the Application Load Balancer (ALB). ALB terminates HTTP and runs health checks.'
      },
      {
        num: '3',
        title: 'Auto Scaling',
        desc: 'The ASG maintains a cluster (1-3 nodes) in private subnets, dynamically scaling up/down in response to traffic load.'
      },
      {
        num: '4',
        title: 'EC2 & Nginx',
        desc: 'EC2 t3.micro nodes running Nginx serve the core HTML, CSS, and JS web app files locally and securely.'
      }
    ];

    const cardW = 1.9;
    const cardH = 3.5;
    const cardY = 1.4;
    const gap = 0.2;
    const startX = (10.0 - (4 * cardW + 3 * gap)) / 2;

    steps.forEach((s, idx) => {
      const x = startX + idx * (cardW + gap);
      
      // Card Background
      slide.addShape('rect', {
        x: x,
        y: cardY,
        w: cardW,
        h: cardH,
        fill: { color: COLORS.LIGHT_BG },
        line: { color: COLORS.BORDER, width: 1 }
      });
      
      // Number bubble
      slide.addShape('oval', {
        x: x + 0.75,
        y: cardY + 0.2,
        w: 0.4,
        h: 0.4,
        fill: { color: COLORS.NAVY },
        line: { width: 0 }
      });
      
      slide.addText(s.num, {
        x: x + 0.75,
        y: cardY + 0.23,
        w: 0.4,
        h: 0.3,
        fontFace: 'Segoe UI',
        fontSize: 12,
        color: COLORS.WHITE,
        bold: true,
        align: 'center'
      });
      
      // Card Title
      slide.addText(s.title, {
        x: x + 0.1,
        y: cardY + 0.7,
        w: cardW - 0.2,
        h: 0.4,
        fontFace: 'Segoe UI',
        fontSize: 11,
        color: COLORS.NAVY,
        bold: true,
        align: 'center'
      });
      
      // Card Description
      slide.addText(s.desc, {
        x: x + 0.1,
        y: cardY + 1.2,
        w: cardW - 0.2,
        h: 2.1,
        fontFace: 'Segoe UI',
        fontSize: 9,
        color: COLORS.TEXT,
        align: 'center'
      });

      // Draw right arrow between cards
      if (idx < 3) {
        const arrowX = x + cardW + 0.04;
        slide.addShape('rect', {
          x: arrowX,
          y: cardY + 1.6,
          w: 0.12,
          h: 0.02,
          fill: { color: COLORS.SKY },
          line: { width: 0 }
        });
      }
    });
  }

  // ==========================================
  // Slide 4: Infrastructure Architecture Diagram (Light Theme)
  // ==========================================
  {
    const slide = createLightSlide('Infrastructure Architecture Diagram');
    
    const imgPath = path.join(__dirname, 'docs', 'phase5', 'architecture-diagram.png');
    if (fs.existsSync(imgPath)) {
      slide.addImage({
        path: imgPath,
        x: 2.78,
        y: 1.3,
        w: 4.44,
        h: 3.7
      });
    } else {
      slide.addText('[Architecture Diagram Image Missing]', {
        x: 2.78,
        y: 2.5,
        w: 4.44,
        h: 1.0,
        fontSize: 14,
        align: 'center',
        color: 'EF4444'
      });
    }
  }

  // ==========================================
  // Slide 5: Security Hardening & Decisions (Light Theme)
  // ==========================================
  {
    const slide = createLightSlide('Security Hardening & Decisions');

    const secCards = [
      {
        title: 'Identity & Access Management (IAM)',
        points: [
          'Group-based access control via AWS CloudCapstoneTeam group.',
          'Principle of least privilege: six scoped AWS-managed policies instead of root/administrator privileges.',
          'No programmatic credentials in source control; kept in local config.'
        ]
      },
      {
        title: 'Network Segregation',
        points: [
          'EC2 Security Groups restrict ingress strictly to HTTP/HTTPS.',
          'SSH access is restricted to eddie-key.pem and not publicly open.',
          'Isolated target groups ensure only ALB can communicate directly with the backend nodes.'
        ]
      },
      {
        title: 'Transport Security',
        points: [
          'Enforced HTTPS across the entire network.',
          'CloudFront handles HTTP -> HTTPS redirection automatically.',
          'AWS Certificate Manager (ACM) provisions DNS-validated TLS certificates with automated renewals.'
        ]
      },
      {
        title: 'CI/CD & Observability Secrets',
        points: [
          'Deployment credentials stored securely as encrypted GitHub Secrets.',
          'AWS Budgets Free-Tier alert at $0.01 prevents unexpected charges.',
          'Nginx logs streamed to CloudWatch for active auditing and retention.'
        ]
      }
    ];

    const cardW = 4.0;
    const cardH = 1.7;
    const gapX = 0.4;
    const gapY = 0.2;
    const startX = 0.8;
    const startY = 1.4;

    secCards.forEach((c, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);

      // Card Background
      slide.addShape('rect', {
        x: x,
        y: y,
        w: cardW,
        h: cardH,
        fill: { color: COLORS.LIGHT_BG },
        line: { color: COLORS.BORDER, width: 1 }
      });

      // Card Title
      slide.addText(c.title, {
        x: x + 0.15,
        y: y + 0.1,
        w: cardW - 0.3,
        h: 0.3,
        fontFace: 'Segoe UI',
        fontSize: 11,
        color: COLORS.NAVY,
        bold: true
      });

      // Bullet points
      c.points.forEach((p, pIdx) => {
        slide.addShape('rect', {
          x: x + 0.2,
          y: y + 0.45 + pIdx * 0.4,
          w: 0.05,
          h: 0.05,
          fill: { color: COLORS.SKY },
          line: { width: 0 }
        });

        slide.addText(p, {
          x: x + 0.3,
          y: y + 0.38 + pIdx * 0.4,
          w: cardW - 0.45,
          h: 0.38,
          fontFace: 'Segoe UI',
          fontSize: 8.5,
          color: COLORS.TEXT
        });
      });
    });
  }

  // ==========================================
  // Slide 6: Automated GitHub Actions CI/CD (Light Theme)
  // ==========================================
  {
    const slide = createLightSlide('Continuous Integration & Deployment (CI/CD)');

    // Left Column: Flow
    slide.addText('DEPLOYMENT PIPELINE FLOW', {
      x: 0.8,
      y: 1.3,
      w: 4.0,
      h: 0.3,
      fontFace: 'Segoe UI',
      fontSize: 13,
      color: COLORS.NAVY,
      bold: true
    });

    const flowSteps = [
      '1. Code Push: Developer pushes changes to the main branch.',
      '2. Pipeline Trigger: GitHub Actions runner reads .github/workflows/deploy.yml.',
      '3. Remote SSH: Secure login to EC2 instance using appleboy/ssh-action.',
      '4. Deploy Script: Runs git pull, copies files, checks nginx -t, and reloads Nginx.'
    ];

    flowSteps.forEach((s, idx) => {
      // Step box
      slide.addShape('rect', {
        x: 0.8,
        y: 1.7 + idx * 0.8,
        w: 4.0,
        h: 0.7,
        fill: { color: COLORS.LIGHT_BG },
        line: { color: COLORS.BORDER, width: 1 }
      });

      slide.addText(s, {
        x: 0.9,
        y: 1.72 + idx * 0.8,
        w: 3.8,
        h: 0.65,
        fontFace: 'Segoe UI',
        fontSize: 8.5,
        color: COLORS.TEXT
      });
    });

    // Right Column: Advantages
    slide.addText('PIPELINE ADVANTAGES & SECURITY', {
      x: 5.2,
      y: 1.3,
      w: 4.0,
      h: 0.3,
      fontFace: 'Segoe UI',
      fontSize: 13,
      color: COLORS.NAVY,
      bold: true
    });

    const advantages = [
      {
        title: 'Security-First',
        desc: 'All deployment keys (SSH Private Key, Host IP, and Username) are stored encrypted in GitHub Secrets; no credentials ever touch the repository.'
      },
      {
        title: 'Zero Downtime',
        desc: 'Nginx reloads its configuration dynamically in milliseconds, meaning active users experience no connection loss or server interruptions.'
      },
      {
        title: 'Consistency & Reliability',
        desc: 'Eliminates human error from manual file transfer processes. The server state matches the main branch state exactly after every run.'
      }
    ];

    advantages.forEach((a, idx) => {
      // Advantage card
      slide.addShape('rect', {
        x: 5.2,
        y: 1.7 + idx * 1.05,
        w: 4.0,
        h: 0.95,
        fill: { color: COLORS.BLUE_LIGHT },
        line: { color: COLORS.SKY, width: 1 }
      });

      slide.addText(a.title, {
        x: 5.3,
        y: 1.72 + idx * 1.05,
        w: 3.8,
        h: 0.25,
        fontFace: 'Segoe UI',
        fontSize: 10,
        color: COLORS.NAVY,
        bold: true
      });

      slide.addText(a.desc, {
        x: 5.3,
        y: 1.95 + idx * 1.05,
        w: 3.8,
        h: 0.68,
        fontFace: 'Segoe UI',
        fontSize: 8.5,
        color: COLORS.TEXT
      });
    });
  }

  // ==========================================
  // Slide 7: Kanban Workflow & Sprint Planning (Light Theme)
  // ==========================================
  {
    const slide = createLightSlide('Project Management & Kanban Board');

    // Left Column: Kanban Structure
    slide.addText('TRELLO KANBAN STRUCTURE', {
      x: 0.8,
      y: 1.3,
      w: 4.0,
      h: 0.3,
      fontFace: 'Segoe UI',
      fontSize: 13,
      color: COLORS.NAVY,
      bold: true
    });

    const boardCols = [
      { col: 'Backlog', desc: 'Planned tasks and configurations not yet started.' },
      { col: 'In Progress', desc: 'Active development or deployment configurations in progress.' },
      { col: 'Peer Review', desc: 'Completed tasks waiting for review and approval by other team members.' },
      { col: 'Done', desc: '100% completed tasks, verified, merged, and active on production environment.' }
    ];

    boardCols.forEach((bc, idx) => {
      slide.addShape('rect', {
        x: 0.8,
        y: 1.7 + idx * 0.8,
        w: 4.0,
        h: 0.7,
        fill: { color: COLORS.LIGHT_BG },
        line: { color: COLORS.BORDER, width: 1 }
      });

      slide.addText(`${bc.col}: ${bc.desc}`, {
        x: 0.9,
        y: 1.72 + idx * 0.8,
        w: 3.8,
        h: 0.65,
        fontFace: 'Segoe UI',
        fontSize: 8.5,
        color: COLORS.TEXT,
        bold: true
      });
    });

    // Right Column: Sprint Slices
    slide.addText('SPRINT PROGRESSION BY PHASE', {
      x: 5.2,
      y: 1.3,
      w: 4.0,
      h: 0.3,
      fontFace: 'Segoe UI',
      fontSize: 13,
      color: COLORS.NAVY,
      bold: true
    });

    const sprints = [
      { title: 'Phase 1: Setup & Foundation', desc: 'Provisioned basic compute nodes (EC2), security roles (IAM), object storage (S3), and requested TLS certificate.' },
      { title: 'Phase 2: App & Compute Configuration', desc: 'Configured Nginx web server, Application Load Balancer routing, Target Group health checks, and Auto Scaling templates.' },
      { title: 'Phase 3: CDN & Custom Domain Go-Live', desc: 'Deployed CloudFront distribution, Namecheap DNS record routing, and HTTPS redirect verification.' },
      { title: 'Phase 4: Observation & CI/CD Pipeline', desc: 'Wrote GitHub Actions workflow script, attached CloudWatch logs/alarms, and configured Budget monitoring limits.' }
    ];

    sprints.forEach((s, idx) => {
      slide.addShape('rect', {
        x: 5.2,
        y: 1.7 + idx * 0.8,
        w: 4.0,
        h: 0.7,
        fill: { color: COLORS.BLUE_LIGHT },
        line: { color: COLORS.SKY, width: 1 }
      });

      slide.addText(s.title, {
        x: 5.3,
        y: 1.72 + idx * 0.8,
        w: 3.8,
        h: 0.22,
        fontFace: 'Segoe UI',
        fontSize: 9,
        color: COLORS.NAVY,
        bold: true
      });

      slide.addText(s.desc, {
        x: 5.3,
        y: 1.95 + idx * 0.8,
        w: 3.8,
        h: 0.43,
        fontFace: 'Segoe UI',
        fontSize: 8,
        color: COLORS.TEXT
      });
    });
  }

  // ==========================================
  // Slide 8: Trello Board Showcase (Light Theme)
  // ==========================================
  {
    const slide = createLightSlide('Trello Kanban Board Showcase');

    const imgPath = path.join(__dirname, 'docs', 'phase5', 'trello-board.png');
    if (fs.existsSync(imgPath)) {
      slide.addImage({
        path: imgPath,
        x: 1.3,
        y: 1.3,
        w: 7.4,
        h: 3.7
      });
    } else {
      slide.addText('[Trello Board Screenshot Image Missing]', {
        x: 1.3,
        y: 2.5,
        w: 7.4,
        h: 1.0,
        fontSize: 14,
        align: 'center',
        color: 'EF4444'
      });
    }
  }

  // ==========================================
  // Slide 9: Live Application Demo (Light Theme)
  // ==========================================
  {
    const slide = createLightSlide('Live Application Demo');

    // Live URL box
    slide.addShape('rect', {
      x: 0.8,
      y: 1.3,
      w: 8.4,
      h: 0.8,
      fill: { color: COLORS.BLUE_LIGHT },
      line: { color: COLORS.SKY, width: 1 }
    });

    slide.addText('SECURE PRODUCTION DEPLOYMENT URL', {
      x: 0.8,
      y: 1.35,
      w: 8.4,
      h: 0.2,
      fontFace: 'Segoe UI',
      fontSize: 9,
      color: COLORS.SKY,
      bold: true,
      align: 'center'
    });

    slide.addText('https://www.studentstudyplannerxyz.xyz/', {
      x: 0.8,
      y: 1.55,
      w: 8.4,
      h: 0.4,
      fontFace: 'Segoe UI',
      fontSize: 18,
      color: COLORS.NAVY,
      bold: true,
      align: 'center'
    });

    // Left Column: Step-by-Step Live Demo script
    slide.addText('STEP-BY-STEP LIVE DEMO GUIDE', {
      x: 0.8,
      y: 2.3,
      w: 4.0,
      h: 0.3,
      fontFace: 'Segoe UI',
      fontSize: 12,
      color: COLORS.NAVY,
      bold: true
    });

    const demoSteps = [
      '1. SSL/TLS Verification: Check lock icon in the browser address bar to show DNS-validated certificate (issued via AWS ACM).',
      '2. Functional Testing: Enter study tasks with subjects, set urgency priorities, and specify academic due dates.',
      '3. Dynamic Progress Indicator: Mark tasks complete to watch progress bar percentage increase in real time.',
      '4. Local Storage Persistence: Refresh page or toggle offline mode to verify data remains saved on the client browser.',
      '5. Headers Verification: Verify X-Cache: Hit from cloudfront header in DevTools network tab.'
    ];

    demoSteps.forEach((s, idx) => {
      slide.addShape('rect', {
        x: 0.8,
        y: 2.65 + idx * 0.48,
        w: 4.0,
        h: 0.42,
        fill: { color: COLORS.LIGHT_BG },
        line: { color: COLORS.BORDER, width: 1 }
      });

      slide.addText(s, {
        x: 0.9,
        y: 2.67 + idx * 0.48,
        w: 3.8,
        h: 0.38,
        fontFace: 'Segoe UI',
        fontSize: 8,
        color: COLORS.TEXT
      });
    });

    // Right Column: Demo video & repository info
    slide.addText('DEMO RESOURCES & METRICS', {
      x: 5.2,
      y: 2.3,
      w: 4.0,
      h: 0.3,
      fontFace: 'Segoe UI',
      fontSize: 12,
      color: COLORS.NAVY,
      bold: true
    });

    // Video card
    slide.addShape('rect', {
      x: 5.2,
      y: 2.65,
      w: 4.0,
      h: 1.1,
      fill: { color: COLORS.LIGHT_BG },
      line: { color: COLORS.BORDER, width: 1 }
    });

    slide.addText('🎥 DEMO RECORDING LINK', {
      x: 5.35,
      y: 2.7,
      w: 3.7,
      h: 0.2,
      fontFace: 'Segoe UI',
      fontSize: 10,
      color: COLORS.NAVY,
      bold: true
    });

    slide.addText('https://drive.google.com/file/d/1DXGpDX82FUIWEva6sP-sFRv0VPGFDekr/view?usp=sharing', {
      x: 5.35,
      y: 2.9,
      w: 3.7,
      h: 0.8,
      fontFace: 'Segoe UI',
      fontSize: 8.5,
      color: COLORS.SKY,
      bold: true
    });

    // Tech Specs card
    slide.addShape('rect', {
      x: 5.2,
      y: 3.9,
      w: 4.0,
      h: 1.15,
      fill: { color: COLORS.LIGHT_BG },
      line: { color: COLORS.BORDER, width: 1 }
    });

    slide.addText('⚙️ PERFORMANCE SPECS', {
      x: 5.35,
      y: 3.95,
      w: 3.7,
      h: 0.2,
      fontFace: 'Segoe UI',
      fontSize: 10,
      color: COLORS.NAVY,
      bold: true
    });

    slide.addText('• Edge delivery: Served in under 50ms worldwide via CDN caching.\n• Failover capability: Auto-scales across availability zones automatically.\n• Scalability: ASG group configuration supports up to 300 active connections.', {
      x: 5.35,
      y: 4.2,
      w: 3.7,
      h: 0.82,
      fontFace: 'Segoe UI',
      fontSize: 8.5,
      color: COLORS.TEXT
    });
  }

  // ==========================================
  // Slide 10: Challenges Faced — Part 1 (Light Theme)
  // ==========================================
  {
    const slide = createLightSlide('Challenges & Resolutions — DevOps & Server');

    const challengesPart1 = [
      {
        id: '1',
        title: 'GitHub Actions Workflow Parser Error',
        cause: 'Indentation syntax bug: on: and jobs: definitions in deploy.yml had 3 leading spaces instead of 0 column boundary, which is invalid YAML syntax.',
        res: 'Corrected indentation to meet standard YAML specifications (aligned jobs/on to root). Re-pushed and pipeline successfully initialized.'
      },
      {
        id: '2',
        title: 'Starter Template Node.js Commands Failure',
        cause: 'The default starter script attempted to run node-specific commands like npm install and pm2 restart on the server. However, our study planner application is a static site that only needs Nginx.',
        res: 'Replaced node server logic in workflow script with git pull, file copy (cp), directory ownership adjustments (chown), Nginx syntax checks (nginx -t), and zero-downtime reloads.'
      },
      {
        id: '3',
        title: 'CloudFront 502 Bad Gateway Origin Mismatch',
        cause: 'CloudFront origin was configured to communicate with the ALB over HTTPS only. However, the ALB was configured with an HTTP listener on port 80, causing connection handshake failures.',
        res: 'Updated the CloudFront distribution origin protocol policy to HTTP-Only to match the ALB listener configuration. Traffic forwarded correctly.'
      },
      {
        id: '4',
        title: 'EC2 Amazon Linux 2023 Base Lacks Git',
        cause: 'Amazon Linux 2023 minimal AMI does not include a Git binary pre-installed. The initial GitHub actions runner failed to pull code from repository.',
        res: 'Manually logged into the EC2 host and executed sudo dnf install -y git. Performed initial clone, allowing subsequent SSH pulls to run automatically.'
      }
    ];

    const cardW = 4.0;
    const cardH = 1.7;
    const gapX = 0.4;
    const gapY = 0.2;
    const startX = 0.8;
    const startY = 1.4;

    challengesPart1.forEach((c, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);

      // Card Background
      slide.addShape('rect', {
        x: x,
        y: y,
        w: cardW,
        h: cardH,
        fill: { color: COLORS.LIGHT_BG },
        line: { color: COLORS.BORDER, width: 1 }
      });

      // Number Bubble
      slide.addShape('oval', {
        x: x + 0.15,
        y: y + 0.1,
        w: 0.25,
        h: 0.25,
        fill: { color: COLORS.RED_TEXT },
        line: { width: 0 }
      });

      slide.addText(c.id, {
        x: x + 0.15,
        y: y + 0.11,
        w: 0.25,
        h: 0.2,
        fontFace: 'Segoe UI',
        fontSize: 8.5,
        color: COLORS.WHITE,
        bold: true,
        align: 'center'
      });

      // Title
      slide.addText(c.title, {
        x: x + 0.45,
        y: y + 0.08,
        w: cardW - 0.6,
        h: 0.3,
        fontFace: 'Segoe UI',
        fontSize: 9.5,
        color: COLORS.RED_TEXT,
        bold: true
      });

      // Cause and Resolution
      slide.addText(`Root Cause: ${c.cause}`, {
        x: x + 0.15,
        y: y + 0.38,
        w: cardW - 0.3,
        h: 0.6,
        fontFace: 'Segoe UI',
        fontSize: 8,
        color: COLORS.TEXT
      });

      slide.addText(`Resolution: ${c.res}`, {
        x: x + 0.15,
        y: y + 1.05,
        w: cardW - 0.3,
        h: 0.6,
        fontFace: 'Segoe UI',
        fontSize: 8,
        color: COLORS.GREEN_TEXT,
        bold: true
      });
    });
  }

  // ==========================================
  // Slide 11: Challenges Faced — Part 2 (Light Theme)
  // ==========================================
  {
    const slide = createLightSlide('Challenges & Resolutions — DNS & Security');

    const challengesPart2 = [
      {
        id: '5',
        title: 'Domain Apex (@) Resolution Fail',
        cause: 'Standard CNAME records cannot be attached directly to domain apex (studentstudyplannerxyz.xyz) according to DNS specs.',
        res: 'Configured an ALIAS record (mapping @ to CloudFront domain) using Namecheap Advanced DNS server settings.'
      },
      {
        id: '6',
        title: 'ACM TLS Certificate Stuck in Pending',
        cause: 'DNS CNAME verification records provided by AWS ACM were not added to domain registrar settings, blocking verification.',
        res: 'Copied ACM-generated CNAME validation record names and values and added them to Namecheap DNS records. Issued in 5 minutes.'
      },
      {
        id: '7',
        title: 'CloudFront Serving Cache Misses (X-Cache: Miss)',
        cause: 'Distribution caching configuration was set to CachingDisabled policy during early debugging, preventing edge cache storage.',
        res: 'Adjusted default TTL and verified caching behaviors to ensure static assets store on CloudFront edge locations, while dynamic ALB bypasses.'
      }
    ];

    const cardW = 2.65;
    const cardH = 3.5;
    const gap = 0.22;
    const startX = (10.0 - (3 * cardW + 2 * gap)) / 2;
    const startY = 1.4;

    challengesPart2.forEach((c, idx) => {
      const x = startX + idx * (cardW + gap);
      const y = startY;

      // Card Background
      slide.addShape('rect', {
        x: x,
        y: y,
        w: cardW,
        h: cardH,
        fill: { color: COLORS.LIGHT_BG },
        line: { color: COLORS.BORDER, width: 1 }
      });

      // Number Bubble
      slide.addShape('oval', {
        x: x + 0.15,
        y: y + 0.15,
        w: 0.28,
        h: 0.28,
        fill: { color: COLORS.RED_TEXT },
        line: { width: 0 }
      });

      slide.addText(c.id, {
        x: x + 0.15,
        y: y + 0.17,
        w: 0.28,
        h: 0.25,
        fontFace: 'Segoe UI',
        fontSize: 8.5,
        color: COLORS.WHITE,
        bold: true,
        align: 'center'
      });

      // Title
      slide.addText(c.title, {
        x: x + 0.5,
        y: y + 0.12,
        w: cardW - 0.6,
        h: 0.38,
        fontFace: 'Segoe UI',
        fontSize: 9.5,
        color: COLORS.RED_TEXT,
        bold: true
      });

      // Cause and Resolution
      slide.addText(`Root Cause:\n${c.cause}`, {
        x: x + 0.15,
        y: y + 0.6,
        w: cardW - 0.3,
        h: 1.3,
        fontFace: 'Segoe UI',
        fontSize: 8.5,
        color: COLORS.TEXT
      });

      slide.addText(`Resolution:\n${c.res}`, {
        x: x + 0.15,
        y: y + 2.0,
        w: cardW - 0.3,
        h: 1.3,
        fontFace: 'Segoe UI',
        fontSize: 8.5,
        color: COLORS.GREEN_TEXT,
        bold: true
      });
    });
  }

  // ==========================================
  // Slide 12: Lessons & Future Enhancements (Light Theme)
  // ==========================================
  {
    const slide = createLightSlide('Lessons & Future Enhancements');

    // Left column: What Worked Well
    slide.addShape('rect', {
      x: 0.8,
      y: 1.3,
      w: 4.0,
      h: 3.6,
      fill: { color: COLORS.BLUE_LIGHT },
      line: { color: COLORS.SKY, width: 1 }
    });

    slide.addText('WHAT WORKED WELL', {
      x: 1.0,
      y: 1.45,
      w: 3.6,
      h: 0.3,
      fontFace: 'Segoe UI',
      fontSize: 14,
      color: COLORS.NAVY,
      bold: true
    });

    const workedPoints = [
      'Layered AWS Architecture: Decoupling CDN, Application Load Balancer, and ASG compute nodes protected backend EC2 IPs and isolated layer configurations.',
      'Active Observability & Budget Guardrails: Budget alerting at $0.01 threshold gave our team high confidence to experiment without worrying about runaway AWS fees.',
      'CI/CD Pipeline Integration: GitHub Actions workflow automation successfully reduced code update deployment times from 5 minutes to under 30 seconds.'
    ];

    workedPoints.forEach((p, idx) => {
      slide.addShape('rect', {
        x: 1.0,
        y: 1.95 + idx * 1.0,
        w: 0.08,
        h: 0.08,
        fill: { color: COLORS.NAVY },
        line: { width: 0 }
      });

      slide.addText(p, {
        x: 1.15,
        y: 1.85 + idx * 1.0,
        w: 3.45,
        h: 0.95,
        fontFace: 'Segoe UI',
        fontSize: 10,
        color: COLORS.TEXT
      });
    });

    // Right column: What We'd Do Differently
    slide.addShape('rect', {
      x: 5.2,
      y: 1.3,
      w: 4.0,
      h: 3.6,
      fill: { color: COLORS.LIGHT_BG },
      line: { color: COLORS.BORDER, width: 1 }
    });

    slide.addText('WHAT WE WOULD DO DIFFERENTLY', {
      x: 5.4,
      y: 1.45,
      w: 3.6,
      h: 0.3,
      fontFace: 'Segoe UI',
      fontSize: 14,
      color: COLORS.NAVY,
      bold: true
    });

    const diffPoints = [
      'Infrastructure as Code (IaC): Transition from Console clicks to writing reusable and versioned Terraform or CloudFormation modules to spawn infrastructures.',
      'Containerization & Serverless: Host static app code files on S3 buckets or run compute nodes as AWS ECS Fargate tasks to completely avoid VM server maintenance.',
      'RDS Persistent Backend: Connect RDS (PostgreSQL) or DynamoDB tables to synchronize study planner tasks, replacing browser-isolated localStorage.'
    ];

    diffPoints.forEach((p, idx) => {
      slide.addShape('rect', {
        x: 5.4,
        y: 1.95 + idx * 1.0,
        w: 0.08,
        h: 0.08,
        fill: { color: COLORS.SKY },
        line: { width: 0 }
      });

      slide.addText(p, {
        x: 5.55,
        y: 1.85 + idx * 1.0,
        w: 3.45,
        h: 0.95,
        fontFace: 'Segoe UI',
        fontSize: 10,
        color: COLORS.TEXT
      });
    });
  }

  // ==========================================
  // Slide 13: Thank You / Q&A Slide (Dark Theme)
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.SLATE_DARK };

    slide.addText('THANK YOU!', {
      x: 0.5,
      y: 1.5,
      w: 9.0,
      h: 0.8,
      fontFace: 'Segoe UI',
      fontSize: 36,
      color: COLORS.SKY,
      bold: true,
      align: 'center'
    });

    slide.addText('Questions & Discussion', {
      x: 0.5,
      y: 2.3,
      w: 9.0,
      h: 0.5,
      fontFace: 'Segoe UI',
      fontSize: 18,
      color: COLORS.WHITE,
      align: 'center'
    });

    // Repository & App Links Box
    slide.addShape('rect', {
      x: 2.5,
      y: 3.1,
      w: 5.0,
      h: 1.5,
      fill: { color: COLORS.SLATE_CARD },
      line: { color: '334155', width: 1 }
    });

    slide.addText('PROJECT RESOURCES', {
      x: 2.5,
      y: 3.2,
      w: 5.0,
      h: 0.25,
      fontFace: 'Segoe UI',
      fontSize: 10,
      color: COLORS.SKY,
      bold: true,
      align: 'center'
    });

    slide.addText('GitHub Repository:\nhttps://github.com/GeekKwame/aws-capstone-project\n\nLive Deployment URL:\nhttps://www.studentstudyplannerxyz.xyz/', {
      x: 2.7,
      y: 3.5,
      w: 4.6,
      h: 1.0,
      fontFace: 'Segoe UI',
      fontSize: 9.5,
      color: COLORS.WHITE,
      align: 'center'
    });
  }

  // Ensure output directory exists
  const outputDir = path.join(__dirname, 'docs', 'phase5');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, 'presentation.pptx');
  
  try {
    await pptx.writeFile({ fileName: outputPath });
    console.log('Success! PowerPoint presentation saved at: ' + outputPath);
  } catch (err) {
    console.error('Error writing PowerPoint file:', err);
  }
}

main();