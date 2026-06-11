const fs = require('fs');
const path = require('path');

// ── Paths ──────────────────────────────────────────────────────────────────
const readmePath  = path.join(__dirname, '..', 'docs', 'phase2', 'README.md');
const screensDir  = path.join(__dirname, '..', 'docs', 'phase2', 'screenshots');
const outputPath  = path.join(__dirname, '..', 'docs', 'phase2', 'phase2_report.docx');

// ── Load modules ───────────────────────────────────────────────────────────
const { marked }    = require('marked');
const HTMLtoDOCX    = require('html-to-docx');

// ── Read README ────────────────────────────────────────────────────────────
let markdown = fs.readFileSync(readmePath, 'utf8');

// ── Inline images as base64 data URIs ─────────────────────────────────────
markdown = markdown.replace(/!\[([^\]]*)\]\(screenshots\/([^)]+)\)/g, (match, alt, filename) => {
  const imgPath = path.join(screensDir, filename);
  if (!fs.existsSync(imgPath)) {
    console.warn(`  ⚠  Missing: screenshots/${filename} — skipping image`);
    return `_[Screenshot: ${alt}]_`;
  }
  const ext  = path.extname(filename).replace('.', '').toLowerCase();
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
  const b64  = fs.readFileSync(imgPath).toString('base64');
  console.log(`  ✓  Embedded: screenshots/${filename}`);
  return `![${alt}](data:${mime};base64,${b64})`;
});

// ── Convert Markdown → HTML ────────────────────────────────────────────────
const html = marked(markdown);

// ── Full HTML document ─────────────────────────────────────────────────────
const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.5; }
    h1 { font-size: 20pt; color: #1a3c6e; }
    h2 { font-size: 16pt; color: #1a3c6e; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
    h3 { font-size: 13pt; color: #2e5fa3; }
    h4 { font-size: 11pt; }
    table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 10pt; }
    th, td { border: 1px solid #ccc; padding: 6px 10px; }
    th { background: #1a3c6e; color: white; }
    tr:nth-child(even) { background: #f4f7fc; }
    code { background: #f0f0f0; padding: 2px 5px; border-radius: 3px; font-size: 10pt; }
    pre { background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 4px; font-size: 9pt; overflow-x: auto; }
    pre code { background: none; color: inherit; }
    img { max-width: 600px; height: auto; margin: 10px 0; border: 1px solid #ddd; }
    blockquote { border-left: 4px solid #2e5fa3; margin: 0; padding-left: 12px; color: #555; }
    hr { border: none; border-top: 1px solid #ccc; margin: 20px 0; }
  </style>
</head>
<body>
${html}
</body>
</html>`;

// ── Convert HTML → DOCX ────────────────────────────────────────────────────
(async () => {
  console.log('\nConverting to DOCX...');
  const docxBuffer = await HTMLtoDOCX(fullHtml, null, {
    table: { row: { cantSplit: true } },
    footer: true,
    pageNumber: true,
    margins: { top: 720, right: 720, bottom: 720, left: 720 },
  });

  fs.writeFileSync(outputPath, docxBuffer);
  console.log(`\n✅  Done! DOCX saved to:\n    ${outputPath}`);
})();
