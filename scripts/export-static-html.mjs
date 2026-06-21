import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const siteUrl = process.env.DROPSHADOW_SITE_URL || "http://localhost:3000";
const outputPath = path.join(root, "dropshadow-static-editable.html");

function firstExistingIndex(source, candidates) {
  return candidates
    .map((candidate) => source.indexOf(candidate))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
}

function extractAppHtml(html) {
  const start = html.indexOf('<div class="noise"');
  if (start < 0) {
    throw new Error("Could not find the DropShadow app shell in the rendered HTML.");
  }

  const end = firstExistingIndex(html.slice(start), ["<!--$-->", '<script id="_R_"']);
  if (end == null) {
    throw new Error("Could not find the end of the DropShadow app shell.");
  }

  return html.slice(start, start + end).trim();
}

function rewriteAssetUrls(source) {
  return source
    .replaceAll('src="/assets/', `src="${siteUrl}/assets/`)
    .replaceAll("src='/assets/", `src='${siteUrl}/assets/`)
    .replaceAll('poster="/assets/', `poster="${siteUrl}/assets/`)
    .replaceAll("poster='/assets/", `poster='${siteUrl}/assets/`)
    .replaceAll('href="/assets/', `href="${siteUrl}/assets/`)
    .replaceAll("href='/assets/", `href='${siteUrl}/assets/`)
    .replaceAll('url("/assets/', `url("${siteUrl}/assets/`)
    .replaceAll("url('/assets/", `url('${siteUrl}/assets/`);
}

function rewriteInternalLinks(source) {
  return source
    .replaceAll('href="/press"', `href="${siteUrl}/press"`)
    .replaceAll('href="/support"', `href="${siteUrl}/support"`)
    .replaceAll('href="/privacy"', `href="${siteUrl}/privacy"`)
    .replaceAll('href="/apple-editorial"', `href="${siteUrl}/apple-editorial"`);
}

function addAutoplayHints(source) {
  return source.replaceAll('muted="" playsInline="" loop="" preload="metadata"', 'muted playsinline loop autoplay preload="metadata"');
}

const response = await fetch(siteUrl);
if (!response.ok) {
  throw new Error(`Could not fetch ${siteUrl}: ${response.status} ${response.statusText}`);
}

const rendered = await response.text();
const rawCss = await readFile(path.join(root, "app", "globals.css"), "utf8");
const css = rewriteAssetUrls(rawCss.replace(/^@import\s+"tailwindcss";\s*/u, ""));
const bodyHtml = addAutoplayHints(rewriteInternalLinks(rewriteAssetUrls(extractAppHtml(rendered))));

const staticHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>DropShadow Static Editable</title>
  <meta name="description" content="Editable static HTML mirror of the current DropShadow launch site." />
  <link rel="icon" href="${siteUrl}/assets/app-icon.svg" />
  <style>
${css}
  </style>
</head>
<body>
<!-- Static editable mirror generated from ${siteUrl}. Edit this file in Open Design, then send it back to apply the changes to the real Next.js site. -->
${bodyHtml}
<script>
(() => {
  const siteHeader = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const modal = document.querySelector(".modal");
  const playButton = document.querySelector(".trailer-panel-meta button");
  const closeButton = document.querySelector(".modal-head button");
  const trailerVideo = modal?.querySelector("video");

  menuToggle?.addEventListener("click", () => {
    const open = !siteHeader?.classList.contains("menu-open");
    siteHeader?.classList.toggle("menu-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  function setModal(open) {
    modal?.classList.toggle("open", open);
    document.body.classList.toggle("modal-open", open);
    if (!open) {
      trailerVideo?.pause();
    } else {
      trailerVideo?.play().catch(() => undefined);
    }
  }

  playButton?.addEventListener("click", () => setModal(true));
  closeButton?.addEventListener("click", () => setModal(false));
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) setModal(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setModal(false);
  });

  const videos = Array.from(document.querySelectorAll("video.loop-video"));
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (!(video instanceof HTMLVideoElement)) return;
        if (entry.isIntersecting) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      });
    }, { rootMargin: "120px 0px", threshold: 0.18 });

    videos.forEach((video) => observer.observe(video));
  } else {
    videos.forEach((video) => video.play().catch(() => undefined));
  }

  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = form.querySelector('input[type="email"]');
      const consent = form.querySelector('input[type="checkbox"]');
      const message = form.querySelector(".form-message");
      if (!(email instanceof HTMLInputElement) || !(consent instanceof HTMLInputElement) || !(message instanceof HTMLElement)) return;

      message.classList.remove("success");
      if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.value.trim())) {
        message.textContent = "That doesn’t look like an email.";
        return;
      }
      if (!consent.checked) {
        message.textContent = "Consent is required for launch updates.";
        return;
      }

      message.classList.add("success");
      message.textContent = "Static prototype: form validated. Codex will wire real changes into Next.js.";
    });
  });
})();
</script>
</body>
</html>
`;

await writeFile(outputPath, staticHtml, "utf8");
console.log(outputPath);
