"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { abilityClips, media, obstacleClips, posterForVideo, siteConfig } from "@/lib/site";

function AppIcon() {
  return (
    <span className="app-icon" aria-hidden="true">
      <img src={media.appIcon} alt="" />
    </span>
  );
}

type LoopVideoProps = {
  src: string;
  label: string;
  className?: string;
  loading?: "eager" | "lazy";
};

function LoopVideo({ src, label, className, loading = "lazy" }: LoopVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const inViewRef = useRef(false);
  const poster = posterForVideo(src);
  const [shouldLoad, setShouldLoad] = useState(loading === "eager");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          inViewRef.current = true;
          setShouldLoad(true);
          void video.play().catch(() => undefined);
        } else {
          inViewRef.current = false;
          video.pause();
        }
      },
      { rootMargin: "360px 0px", threshold: 0.12 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;
    video.load();
  }, [shouldLoad, src]);

  function playIfVisible() {
    const video = videoRef.current;
    if (!video) return;
    setIsReady(true);
    if (inViewRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      void video.play().catch(() => undefined);
    }
  }

  const videoClassName = [
    "loop-video",
    className,
    isReady ? "is-ready" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <img className="loop-video-poster" src={poster} alt="" aria-hidden="true" loading="eager" decoding="async" />
      <video
        ref={videoRef}
        className={videoClassName}
        muted
        playsInline
        loop
        preload="none"
        poster={poster}
        aria-label={label}
        data-src={src}
        onCanPlay={playIfVisible}
        onLoadedData={playIfVisible}
        onPlaying={() => setIsReady(true)}
        onError={() => setIsReady(false)}
      >
        {shouldLoad ? <source src={src} type="video/mp4" /> : null}
      </video>
    </>
  );
}

export function HomePage() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const mazeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState<"error" | "success" | "neutral">("neutral");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const scope = pageRef.current;
    if (!scope || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let observer: IntersectionObserver | undefined;
    const splitRestores: Array<() => void> = [];
    const activeTweens: Array<{ kill: () => void }> = [];
    const triggered = new WeakSet<Element>();
    const animatedElements = new Set<HTMLElement>();

    void import("gsap").then(({ gsap }) => {
      if (disposed || !scope.isConnected) return;

      const splitTextElements = Array.from(scope.querySelectorAll<HTMLElement>(".split-text"));

      function splitTextElement(element: HTMLElement) {
        const originalHtml = element.innerHTML;
        const textNodes: Text[] = [];
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
          acceptNode(node) {
            if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
            if (node.parentElement?.closest(".split-word-mask")) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          }
        });

        while (walker.nextNode()) {
          textNodes.push(walker.currentNode as Text);
        }

        textNodes.forEach((node) => {
          const fragment = document.createDocumentFragment();
          const parts = node.textContent?.split(/(\s+)/) ?? [];

          parts.forEach((part) => {
            if (!part) return;

            if (/^\s+$/.test(part)) {
              fragment.append(document.createTextNode(part));
              return;
            }

            const mask = document.createElement("span");
            const word = document.createElement("span");
            mask.className = "split-word-mask";
            word.className = "split-word-inner";

            Array.from(part).forEach((character) => {
              const letter = document.createElement("span");
              letter.className = "split-letter";
              letter.textContent = character;
              word.append(letter);
            });

            mask.append(word);
            fragment.append(mask);
          });

          node.replaceWith(fragment);
        });

        splitRestores.push(() => {
          element.innerHTML = originalHtml;
        });
      }

      splitTextElements.forEach(splitTextElement);

      const splitTargets = Array.from(scope.querySelectorAll<HTMLElement>(".split-letter"));
      const revealElements = Array.from(scope.querySelectorAll<HTMLElement>(".reveal")).filter(
        (element) => !element.classList.contains("split-text") && !element.querySelector(".split-text")
      );
      const targets = [...splitTextElements, ...revealElements];

      function markAnimated(elements: HTMLElement[]) {
        elements.forEach((element) => animatedElements.add(element));
      }

      markAnimated([...splitTargets, ...revealElements]);
      gsap.set(splitTargets, { yPercent: 118 });
      gsap.set(revealElements, { autoAlpha: 0, y: 26 });

      function animateIn(element: HTMLElement, order = 0) {
        if (triggered.has(element)) return;
        triggered.add(element);

        if (element.classList.contains("split-text")) {
          const letters = Array.from(element.querySelectorAll<HTMLElement>(".split-letter"));
          if (!letters.length) return;

          markAnimated(letters);
          activeTweens.push(
            gsap.to(letters, {
              duration: 0.78,
              ease: "power4.out",
              stagger: 0.011,
              yPercent: 0
            })
          );
          return;
        }

        markAnimated([element]);
        activeTweens.push(
          gsap.to(element, {
            autoAlpha: 1,
            delay: Math.min(order * 0.04, 0.2),
            duration: 0.75,
            ease: "power3.out",
            y: 0
          })
        );
      }

      function isInView(element: HTMLElement) {
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.96 && rect.bottom > 0;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer?.unobserve(entry.target);
            animateIn(entry.target as HTMLElement);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
      );

      targets.forEach((element, index) => {
        if (isInView(element)) {
          animateIn(element, index);
        } else {
          observer?.observe(element);
        }
      });
    });

    return () => {
      disposed = true;
      observer?.disconnect();
      activeTweens.forEach((tween) => tween.kill());
      animatedElements.forEach((element) => {
        element.style.removeProperty("opacity");
        element.style.removeProperty("visibility");
        element.style.removeProperty("transform");
      });
      splitRestores.forEach((restore) => restore());
    };
  }, []);

  useEffect(() => {
    const canvasElement = mazeCanvasRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canvasElement || reduce) return;

    const context = canvasElement.getContext("2d");
    if (!context) return;

    const canvas = canvasElement;
    const ctx = context;

    type Cell = { n: boolean; e: boolean; s: boolean; w: boolean; v: boolean };

    let frame = 0;
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let cell = 0;
    let offsetX = 0;
    let offsetY = 0;
    let grid: Cell[][] = [];
    let path: Array<[number, number]> = [];
    let head = 0;
    let progress = 0;

    function carve() {
      grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({ n: true, e: true, s: true, w: true, v: false }))
      );

      const stack: Array<[number, number]> = [[0, 0]];
      const order: Array<[number, number]> = [[0, 0]];
      grid[0][0].v = true;

      while (stack.length) {
        const [r, c] = stack[stack.length - 1];
        const options: Array<[number, number, "n" | "e" | "s" | "w"]> = [];

        if (r > 0 && !grid[r - 1][c].v) options.push([r - 1, c, "n"]);
        if (c < cols - 1 && !grid[r][c + 1].v) options.push([r, c + 1, "e"]);
        if (r < rows - 1 && !grid[r + 1][c].v) options.push([r + 1, c, "s"]);
        if (c > 0 && !grid[r][c - 1].v) options.push([r, c - 1, "w"]);

        if (!options.length) {
          stack.pop();
          continue;
        }

        const [nextR, nextC, direction] = options[Math.floor(Math.random() * options.length)];
        if (direction === "n") {
          grid[r][c].n = false;
          grid[nextR][nextC].s = false;
        }
        if (direction === "e") {
          grid[r][c].e = false;
          grid[nextR][nextC].w = false;
        }
        if (direction === "s") {
          grid[r][c].s = false;
          grid[nextR][nextC].n = false;
        }
        if (direction === "w") {
          grid[r][c].w = false;
          grid[nextR][nextC].e = false;
        }

        grid[nextR][nextC].v = true;
        stack.push([nextR, nextC]);
        order.push([nextR, nextC]);
      }

      path = order.length > 1 ? order : [[0, 0], [0, 0]];
      head = 0;
      progress = 0;
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = Math.max(34, Math.round(Math.min(width, height) / 7));
      cols = Math.max(4, Math.floor((width - 24) / cell));
      rows = Math.max(3, Math.floor((height - 24) / cell));
      offsetX = (width - cols * cell) / 2;
      offsetY = (height - rows * cell) / 2;
      carve();
    }

    function drawWalls() {
      ctx.strokeStyle = "#ff2600";
      ctx.lineWidth = Math.max(2, cell * 0.07);
      ctx.lineCap = "round";
      ctx.globalAlpha = 0.92;

      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const x = offsetX + c * cell;
          const y = offsetY + r * cell;
          const item = grid[r][c];
          ctx.beginPath();
          if (item.n) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + cell, y);
          }
          if (item.w) {
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + cell);
          }
          if (item.e && c === cols - 1) {
            ctx.moveTo(x + cell, y);
            ctx.lineTo(x + cell, y + cell);
          }
          if (item.s && r === rows - 1) {
            ctx.moveTo(x, y + cell);
            ctx.lineTo(x + cell, y + cell);
          }
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 0.9;
      ctx.fillStyle = "#ff2600";
      for (let r = 0; r <= rows; r += 1) {
        for (let c = 0; c <= cols; c += 1) {
          if ((r + c) % 3 === 0) {
            ctx.beginPath();
            ctx.arc(offsetX + c * cell, offsetY + r * cell, cell * 0.05, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    function draw() {
      ctx.fillStyle = "#0b0a0d";
      ctx.fillRect(0, 0, width, height);
      drawWalls();

      progress += 0.018;
      if (progress >= 1) {
        progress = 0;
        head = (head + 1) % Math.max(1, path.length - 1);
      }

      const current = path[head];
      const next = path[Math.min(head + 1, path.length - 1)];
      const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const cx = offsetX + (current[1] + (next[1] - current[1]) * eased + 0.5) * cell;
      const cy = offsetY + (current[0] + (next[0] - current[0]) * eased + 0.5) * cell;

      const shadow = path[(head + Math.max(0, path.length - 3)) % path.length];
      const sx = offsetX + (shadow[1] + 0.5) * cell;
      const sy = offsetY + (shadow[0] + 0.5) * cell;
      const shadowGradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, cell * 1.1);
      shadowGradient.addColorStop(0, "rgba(233,231,226,0.10)");
      shadowGradient.addColorStop(1, "rgba(233,231,226,0)");
      ctx.fillStyle = shadowGradient;
      ctx.beginPath();
      ctx.arc(sx, sy, cell * 1.1, 0, Math.PI * 2);
      ctx.fill();

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, cell * 0.9);
      glow.addColorStop(0, "rgba(255,38,0,0.42)");
      glow.addColorStop(1, "rgba(255,38,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, cell * 0.9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ff2600";
      ctx.beginPath();
      ctx.arc(cx, cy, cell * 0.2, 0, Math.PI * 2);
      ctx.fill();

      frame = requestAnimationFrame(draw);
    }

    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      resize();
      frame = requestAnimationFrame(draw);
    });

    resizeObserver.observe(canvas);
    resize();
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const scope = pageRef.current;
    if (!scope) return;
    if (!window.matchMedia("(pointer: fine)").matches || navigator.maxTouchPoints > 0) return;

    const rails = Array.from(scope.querySelectorAll<HTMLElement>(".media-rail, .feature-grid, .daily-layout"));
    const cleanups = rails.map((rail) => {
      let mouseActive = false;
      let startX = 0;
      let startScrollLeft = 0;

      function beginDrag(clientX: number) {
        startX = clientX;
        startScrollLeft = rail.scrollLeft;
        rail.classList.add("is-dragging");
      }

      function updateDrag(clientX: number) {
        const deltaX = clientX - startX;
        rail.scrollLeft = startScrollLeft - deltaX;
        return deltaX;
      }

      function removeMouseListeners() {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      }

      function stopDrag() {
        mouseActive = false;
        rail.classList.remove("is-dragging");
        removeMouseListeners();
      }

      function onMouseDown(event: MouseEvent) {
        if (event.button !== 0) return;
        mouseActive = true;
        beginDrag(event.clientX);
        window.addEventListener("mousemove", onMouseMove, { passive: false });
        window.addEventListener("mouseup", onMouseUp);
      }

      function onMouseMove(event: MouseEvent) {
        if (!mouseActive) return;
        const deltaX = updateDrag(event.clientX);
        if (Math.abs(deltaX) > 4) event.preventDefault();
      }

      function onMouseUp() {
        if (!mouseActive) return;
        stopDrag();
      }

      rail.addEventListener("mousedown", onMouseDown);

      return () => {
        rail.removeEventListener("mousedown", onMouseDown);
        removeMouseListeners();
      };
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  async function submitWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim();
    setMessageKind("error");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setMessage("That doesn’t look like an email.");
      return;
    }

    if (!consent) {
      setMessage("Consent is required for launch updates.");
      return;
    }

    const source =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("src") || "homepage"
        : "homepage";

    setSubmitting(true);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          source,
          consent,
          consentVersion: siteConfig.consentVersion,
          consentText: siteConfig.consentText
        })
      });
      const result = (await response.json()) as { message?: string; code?: string };

      if (response.ok || result.code === "already_registered") {
        setMessageKind("success");
        setMessage(result.message || "You’re on the list. Watch your inbox for the first run.");
        setEmail("");
        setConsent(false);
      } else {
        setMessageKind("error");
        setMessage(result.message || "Something slipped. Try again.");
      }
    } catch {
      setMessageKind("error");
      setMessage("Something slipped. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function renderSignupCard(idPrefix: "hero" | "final") {
    const emailId = `${idPrefix}-email`;
    const consentId = `${idPrefix}-consent`;

    return (
      <form className={`signup-card reveal ${idPrefix === "final" ? "final-signup-card" : ""}`} noValidate onSubmit={submitWaitlist}>
        <div className="app-lockup">
          <AppIcon />
          <div>
            <b>Coming soon on the App Store</b>
            <span>Launch list · first Daily Run</span>
          </div>
        </div>
        <h3>Join the first run.</h3>
        <p className="deck-note">Get the launch notification, major updates, and the first Daily Run.</p>
        <div className="field">
          <label className="fact-label" htmlFor={emailId}>Email</label>
          <input
            id={emailId}
            name="email"
            type="email"
            placeholder="you@email.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <label className="check" htmlFor={consentId}>
          <input
            id={consentId}
            name="consent"
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
          />
          <span>I agree to receive DropShadow launch updates and major game news by email.</span>
        </label>
        <button className="cta" type="submit" disabled={submitting}>
          {submitting ? "Sending..." : "Get notified"} <span className="btn-arrow">→</span>
        </button>
        <div className={`form-message${messageKind === "success" ? " success" : ""}`} role="status" aria-live="polite">
          {message}
        </div>
        <p className="deck-note fine">No spam. Unsubscribe anytime.</p>
      </form>
    );
  }

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="page" ref={pageRef}>
        <header className={`site-header${menuOpen ? " menu-open" : ""}`} id="site-header">
          <nav className="nav" aria-label="Primary">
            <a className="brand" href="#top" aria-label="DropShadow home">
              <AppIcon />
              DropShadow
            </a>
              <button
                className="menu-toggle"
                type="button"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu-panel"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((value) => !value)}
              >
                {menuOpen ? <X size={20} strokeWidth={2.4} aria-hidden="true" /> : <Menu size={20} strokeWidth={2.4} aria-hidden="true" />}
              </button>
              <div className="nav-links" id="nav-links">
                <a href="#chase" onClick={() => setMenuOpen(false)}>The Chase</a>
              <a href="#mass" onClick={() => setMenuOpen(false)}>Mass</a>
              <a href="#rooms" onClick={() => setMenuOpen(false)}>Rooms</a>
              <a href="#droplab" onClick={() => setMenuOpen(false)}>DropLab</a>
              <a href="#daily" onClick={() => setMenuOpen(false)}>Daily</a>
            </div>
            <div className="nav-meta">
              <a href="#trailer" onClick={() => setMenuOpen(false)}>Watch</a>
              <a className="primary" href="#signup" onClick={() => setMenuOpen(false)}>Get notified</a>
            </div>
            <div className="mobile-menu-panel" id="mobile-menu-panel">
              <a href="#chase" onClick={() => setMenuOpen(false)}>The Chase</a>
              <a href="#mass" onClick={() => setMenuOpen(false)}>Mass</a>
              <a href="#rooms" onClick={() => setMenuOpen(false)}>Rooms</a>
              <a href="#droplab" onClick={() => setMenuOpen(false)}>DropLab</a>
              <a href="#daily" onClick={() => setMenuOpen(false)}>Daily</a>
              <a href="#trailer" onClick={() => setMenuOpen(false)}>Watch trailer</a>
              <a className="primary" href="#signup" onClick={() => setMenuOpen(false)}>Get notified</a>
            </div>
          </nav>
        </header>

        <main id="top">
          <section className="section hero" id="signup" aria-labelledby="hero-title">
            <div className="reveal">
              <span className="hero-kicker"><span className="dot" />Drop into the chase</span>
            </div>
            <div className="hero-title reveal">
              <h1 className="display split-text" id="hero-title">
                Every second<br />has <span className="accent-word">weight.</span>
              </h1>
            </div>
            <p className="body-copy reveal">Guide a living drop through deadly rooms while the Shadow hunts every hesitation.</p>

            <div className="launch-grid">
              <div className="trailer-panel reveal" id="trailer">
                <LoopVideo src={media.videos.trailer} label="DropShadow trailer" className="trailer-video" loading="eager" />
              </div>

              {renderSignupCard("hero")}
            </div>

            <div className="hero-meta reveal">
              <div><span className="fact-label">Mode</span><span className="fact-value">Pre-launch</span></div>
              <div><span className="fact-label">Ritual</span><span className="fact-value">Daily Run</span></div>
              <div><span className="fact-label">Platform</span><span className="fact-value">iOS</span></div>
            </div>
          </section>

          <section className="section dark" id="chase" aria-labelledby="chase-title">
            <div className="chapter no-aside">
              <span className="chapter-num reveal">01</span>
              <div>
                <p className="eyebrow reveal">The loop</p>
                <h2 className="headline split-text" id="chase-title">Move with intent. Recover mass. Outrun the thing behind you.</h2>
                <p className="body-copy reveal">DropShadow is built around short runs with clear rules: move cleanly, spend mass carefully, read the room, and never let the Shadow turn hesitation into distance lost.</p>

                <div className="feature-grid" aria-label="Core gameplay overview">
                  {[
                    { label: "Run", cue: "Smooth control", src: media.videos.smoothRun },
                    { label: "Recover", cue: "Mass is survival", src: media.videos.mass },
                    { label: "Pressure", cue: "The Shadow follows", src: media.videos.shadow2 }
                  ].map((clip) => (
                    <article className="clip-card reveal" key={clip.src}>
                      <div className="clip-media">
                        <LoopVideo src={clip.src} label={`${clip.label} gameplay`} />
                      </div>
                      <div className="clip-label">
                        <span>{clip.cue}</span>
                        <b>{clip.label}</b>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="section" id="mass" aria-labelledby="mass-title">
            <div className="chapter lesson-layout">
              <span className="chapter-num reveal">02</span>
              <div>
                <p className="eyebrow reveal">Mass</p>
                <h2 className="headline split-text" id="mass-title">You are not losing health. You are losing yourself.</h2>
                <p className="body-copy reveal">Every move costs mass. Every risk can give it back. Stay heavy enough to survive, light enough to slip through.</p>
                <div className="sequence reveal">
                  <div><span>Move</span><b className="neg">- mass</b></div>
                  <div><span>Risk</span><b>recover</b></div>
                  <div><span>Wait</span><b>shadow</b></div>
                  <div><span>Exit</span><b>breathe</b></div>
                </div>
              </div>
              <aside className="lesson-clip reveal">
                <LoopVideo src={media.videos.mass} label="DropShadow mass mechanic gameplay" />
                <div className="clip-label"><span>Mass system</span><b>Lose / recover</b></div>
              </aside>
            </div>
          </section>

          <section className="section" id="rooms" aria-labelledby="rooms-title">
            <div className="chapter no-aside">
              <span className="chapter-num reveal">03</span>
              <div>
                <p className="eyebrow reveal">Rooms</p>
                <h2 className="headline split-text" id="rooms-title">Every room teaches one rule. Then asks if you learned it fast enough.</h2>
                <p className="body-copy reveal">Rotating gates. Collapsing floors. Closing walls. Currents that push you off line. Nothing is random. Everything wants timing.</p>
                <div className="media-rail" aria-label="Room obstacle clips">
                  {obstacleClips.map((clip) => (
                    <article className="rail-card" key={clip.src}>
                      <div className="rail-media">
                        <LoopVideo src={clip.src} label={`${clip.label} obstacle gameplay`} />
                        <b className="rail-name">{clip.label}</b>
                      </div>
                    </article>
                  ))}
                </div>
                <p className="rail-hint">Swipe to explore the room library</p>
              </div>
            </div>
          </section>

          <section className="section dark" id="compass" aria-labelledby="compass-title">
            <div className="chapter">
              <span className="chapter-num reveal">04</span>
              <div>
                <p className="eyebrow reveal">Compass</p>
                <h2 className="headline split-text" id="compass-title">The exit calls. The maze disagrees.</h2>
                <p className="body-copy reveal">A quiet compass points the way forward. It won’t save you. It only tells you what you’re trying not to lose.</p>
              </div>
              <aside className="compass-card reveal">
                <div className="compass-map">
                  <LoopVideo src={media.videos.compass} label="DropShadow compass reveal gameplay" />
                </div>
                <p className="eyebrow">Compass reveal</p>
                <p className="compass-quote">Find the exit.</p>
                <p className="deck-note">Tap the compass, pause the pressure, reveal the maze, then return to the run.</p>
              </aside>
            </div>
          </section>

          <section className="section dark" id="droplab" aria-labelledby="droplab-title">
            <div className="chapter no-aside">
              <span className="chapter-num reveal">05</span>
              <div>
                <p className="eyebrow reveal">DropLab</p>
                <h2 className="headline split-text" id="droplab-title">Build the instinct that saves you.</h2>
                <p className="body-copy reveal">Unlock special abilities between runs, then choose the tool that fits the room: dash through danger, shield a hit, phase past a trap, erase a wall, or generate the mass you need for one more second.</p>
                <div className="media-rail" aria-label="Ability gameplay clips">
                  {abilityClips.map((clip) => (
                    <article className="rail-card" key={clip.src}>
                      <div className="rail-media">
                        <LoopVideo src={clip.src} label={`${clip.label} ability gameplay`} />
                        <b className="rail-name">{clip.label}</b>
                      </div>
                    </article>
                  ))}
                </div>
                <p className="rail-hint">Five abilities · swipe to explore</p>
              </div>
            </div>
          </section>

          <section className="section" id="daily" aria-labelledby="daily-title">
            <div className="chapter no-aside">
              <span className="chapter-num reveal">06</span>
              <div>
                <p className="eyebrow reveal">Daily Run</p>
                <h2 className="headline split-text" id="daily-title">One room. One chance. Everyone gets the same fear.</h2>
                <p className="body-copy reveal">Daily Runs turn DropShadow into a shared ritual: same challenge, same rules, different instincts.</p>

                <div className="daily-layout">
                  <article className="daily-card">
                    <div className="daily-media">
                      <LoopVideo src={media.videos.dailyChallenge} label="DropShadow Daily Challenge gameplay" />
                    </div>
                    <div className="daily-label"><span>Same room. Same rules.</span><b>Daily Challenge</b></div>
                  </article>
                  <article className="daily-card">
                    <div className="daily-media">
                      <LoopVideo src={media.videos.finalSequence} label="DropShadow final sequence gameplay" />
                    </div>
                    <div className="daily-label"><span>Last stretch</span><b>Final Sequence</b></div>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section className="section dark final" aria-labelledby="final-title">
            <div className="chapter no-aside">
              <span className="chapter-num reveal">07</span>
              <div>
                <p className="eyebrow reveal">Be there when the first run opens</p>
                <h2 className="display split-text" id="final-title">The Shadow is almost here.</h2>
                <p className="body-copy reveal">DropShadow is coming to the App Store. Join the launch list and start with the first run.</p>
                {renderSignupCard("final")}
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div>DropShadow · A survival maze game for iOS · hello@dropshadow.it · © 2026</div>
          <nav aria-label="Footer">
            <a href="/support">Support</a>
            <a href="/privacy">Privacy</a>
          </nav>
        </footer>
      </div>

    </>
  );
}
