"use client";

import { FormEvent, useState } from "react";
import { siteConfig } from "@/lib/site";

export function NotifyPrototypeForm({ sourceDefault = "notify" }: { sourceDefault?: string }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState("No spam. Unsubscribe anytime.");
  const [kind, setKind] = useState<"neutral" | "error" | "success">("neutral");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setKind("error");
      setMessage("That doesn’t look like an email.");
      return;
    }

    if (!consent) {
      setKind("error");
      setMessage("Please agree to receive launch updates before joining.");
      return;
    }

    const source =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("src") || sourceDefault
        : sourceDefault;

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
        setKind("success");
        setMessage(result.message || "You’re in. The first run will find you.");
        setEmail("");
        setConsent(false);
      } else {
        setKind("error");
        setMessage(result.message || "Something slipped. Try again.");
      }
    } catch {
      setKind("error");
      setMessage("Something slipped. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={onSubmit}>
      <h2>Join the first run.</h2>
      <label className="field">
        Email
        <input
          name="email"
          type="email"
          placeholder="you@email.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label className="check">
        <input
          name="consent"
          type="checkbox"
          required
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
        />
        <span>
          I agree to receive DropShadow launch updates and major game news by email, and I confirm that I have read the{" "}
          <a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>.
        </span>
      </label>
      <button type="submit" disabled={submitting}>{submitting ? "Sending..." : "Get notified"}</button>
      <div className={`msg ${kind === "error" ? "err" : ""} ${kind === "success" ? "ok" : ""}`} role="status" aria-live="polite">
        {message}
      </div>
    </form>
  );
}
