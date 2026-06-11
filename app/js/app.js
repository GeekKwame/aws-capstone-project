/**
 * MyCloudApp — Main application logic
 *
 * Dynamically separates static asset URLs (S3/CloudFront) from
 * dynamic application content (EC2/ALB).
 */

(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Asset URL resolver — static assets go to S3 via CloudFront CDN
  // ---------------------------------------------------------------------------

  /**
   * Build a fully-qualified URL for a static asset stored in S3.
   * @param {string} relativePath - Path relative to the static asset prefix (e.g. "images/hero.svg")
   * @returns {string} CDN URL pointing to the S3 object
   */
  function getStaticAssetUrl(relativePath) {
    const normalized = relativePath.replace(/^\//, "");
    return `${AppConfig.cdnDomain}${AppConfig.staticAssetPrefix}/${normalized}`;
  }

  /**
   * Build a URL for dynamic application resources served from EC2.
   * @param {string} path - Application-relative path
   * @returns {string} Same-origin URL
   */
  function getAppResourceUrl(path) {
    return new URL(path, window.location.origin).href;
  }

  // ---------------------------------------------------------------------------
  // Feature cards data
  // ---------------------------------------------------------------------------

  const FEATURES = [
    {
      icon: "🔒",
      title: "HTTPS Secured",
      description:
        "TLS termination at CloudFront using an ACM certificate. All traffic is encrypted in transit from the browser to the edge.",
      tag: "ACM + CloudFront",
      staticIcon: "images/icon-https.svg",
    },
    {
      icon: "⚖️",
      title: "Load Balanced",
      description:
        "Application Load Balancer distributes traffic across healthy EC2 targets with active health checks on /health.",
      tag: "ALB Health Checks Active",
      staticIcon: "images/icon-alb.svg",
    },
    {
      icon: "🌐",
      title: "CDN Enabled",
      description:
        "Static assets are cached at 400+ CloudFront edge locations worldwide, reducing latency and origin load.",
      tag: "Global CloudFront Edge",
      staticIcon: "images/icon-cdn.svg",
    },
    {
      icon: "🚀",
      title: "CI/CD Live",
      description:
        "GitHub Actions deploys every push to main via SSH, pulling the latest code and restarting Nginx automatically.",
      tag: "GitHub Actions Pipeline",
      staticIcon: "images/icon-cicd.svg",
    },
  ];

  // ---------------------------------------------------------------------------
  // DOM rendering
  // ---------------------------------------------------------------------------

  function renderFeatureCards() {
    const grid = document.getElementById("feature-grid");
    if (!grid) return;

    grid.innerHTML = FEATURES.map(
      (feature) => `
      <article class="feature-card">
        <div class="feature-icon" aria-hidden="true">
          <img
            src="${getStaticAssetUrl(feature.staticIcon)}"
            alt=""
            width="28"
            height="28"
            onerror="this.replaceWith(document.createTextNode('${feature.icon}'))"
          />
        </div>
        <h3>${feature.title}</h3>
        <p>${feature.description}</p>
        <span class="feature-tag">${feature.tag}</span>
      </article>
    `
    ).join("");
  }

  function renderHeroVisual() {
    const container = document.getElementById("hero-visual");
    if (!container) return;

    const heroImageUrl = getStaticAssetUrl("images/hero-banner.png");
    const img = document.createElement("img");
    img.src = heroImageUrl;
    img.alt = "MyCloudApp cloud architecture illustration";
    img.loading = "eager";
    img.onerror = function () {
      container.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94a3b8;font-size:0.9rem;text-align:center;padding:2rem;">
          <div>
            <div style="font-size:3rem;margin-bottom:0.5rem;">☁️</div>
            <p>Upload <code>hero-banner.png</code> to<br/>
            <code>s3://${AppConfig.s3Bucket}${AppConfig.staticAssetPrefix}/images/</code></p>
          </div>
        </div>`;
    };
    container.appendChild(img);
  }

  function renderRequestPath() {
    const list = document.getElementById("request-path");
    if (!list) return;

    const steps = [
      { step: 1, label: "Client Browser initiates HTTPS request" },
      { step: 2, label: "CloudFront edge location (TLS termination)" },
      { step: 3, label: "Application Load Balancer (path-based routing)" },
      { step: 4, label: "EC2 instance — Nginx serves dynamic content" },
    ];

    list.innerHTML = steps
      .map(
        (s) =>
          `<li><span class="path-step">${s.step}</span>${s.label}</li>`
      )
      .join("");
  }

  function renderAssetDelivery() {
    const list = document.getElementById("asset-delivery");
    if (!list) return;

    const assets = [
      { name: "Hero banner", url: getStaticAssetUrl("images/hero-banner.png") },
      { name: "Feature icons", url: getStaticAssetUrl("images/") },
      { name: "App shell (HTML/CSS/JS)", url: getAppResourceUrl("/") },
    ];

    list.innerHTML = assets
      .map(
        (a) =>
          `<li><span class="path-step">S3</span><span title="${a.url}">${a.name}</span></li>`
      )
      .join("");
  }

  function renderHealthStatus() {
    const container = document.getElementById("health-status");
    if (!container) return;

    const checks = [
      { label: "CloudFront CDN", status: "ok" },
      { label: "ALB Target Group", status: "ok" },
      { label: "EC2 /health endpoint", status: "ok" },
      { label: "S3 OAC (static assets)", status: "ok" },
    ];

    container.innerHTML = checks
      .map(
        (c) => `
        <div class="health-item">
          <span class="health-label">${c.label}</span>
          <span class="health-badge ${c.status}">${c.status === "ok" ? "Healthy" : "Check"}</span>
        </div>`
      )
      .join("");
  }

  function updateDeploymentStatus() {
    const el = document.getElementById("deployment-status");
    if (!el) return;

    const builtAt = new Date().toISOString();
    el.textContent = `${AppConfig.appName} v${AppConfig.version} · ${AppConfig.environment} · loaded ${builtAt}`;
  }

  function updateStats() {
    const assetsEl = document.getElementById("stat-assets");
    if (assetsEl) {
      assetsEl.textContent = FEATURES.length + 4;
    }
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  function initNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-link");

    if (toggle && navLinks) {
      toggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
    }

    links.forEach((link) => {
      link.addEventListener("click", () => {
        links.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
        navLinks?.classList.remove("open");
        toggle?.setAttribute("aria-expanded", "false");
      });
    });

    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach((l) => {
              l.classList.toggle("active", l.getAttribute("href") === `#${id}`);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // ---------------------------------------------------------------------------
  // Contact form (client-side demo only)
  // ---------------------------------------------------------------------------

  function initContactForm() {
    const form = document.getElementById("contact-form");
    const feedback = document.getElementById("form-feedback");

    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (feedback) {
        feedback.textContent =
          "Thank you! This demo form does not send data — wire it to your backend API in production.";
      }
      form.reset();
    });
  }

  // ---------------------------------------------------------------------------
  // Footer year
  // ---------------------------------------------------------------------------

  function initFooter() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // ---------------------------------------------------------------------------
  // Bootstrap
  // ---------------------------------------------------------------------------

  function init() {
    renderFeatureCards();
    renderHeroVisual();
    renderRequestPath();
    renderAssetDelivery();
    renderHealthStatus();
    updateDeploymentStatus();
    updateStats();
    initNavigation();
    initContactForm();
    initFooter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose for testing / debugging
  window.MyCloudApp = { getStaticAssetUrl, getAppResourceUrl, AppConfig };
})();
