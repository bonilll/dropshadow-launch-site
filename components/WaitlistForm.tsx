"use client";

import { ArrowRight, Loader2, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { siteConfig } from "@/lib/site";

type MessageKind = "success" | "error" | "neutral";

type FormMessage = {
  kind: MessageKind;
  text: string;
};

type WaitlistFormProps = {
  defaultSource: string;
  buttonLabel?: string;
};

export function WaitlistForm({ defaultSource, buttonLabel = "Get notified" }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [source] = useState(() => {
    if (typeof window === "undefined") {
      return defaultSource;
    }

    const params = new URLSearchParams(window.location.search);
    return params.get("src") || params.get("ref") || defaultSource;
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<FormMessage>({
    kind: "neutral",
    text: "No spam. Unsubscribe anytime."
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage({ kind: "neutral", text: "Sending..." });

    if (!consent) {
      setMessage({
        kind: "error",
        text: "Please agree to receive DropShadow launch updates before joining."
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          consent,
          consentVersion: siteConfig.consentVersion,
          consentText: siteConfig.consentText
        })
      });

      const result = (await response.json()) as { message?: string; code?: string };

      if (response.ok) {
        setEmail("");
        setConsent(false);
        setMessage({
          kind: "success",
          text: result.message || "You're in. The Shadow will know."
        });
        return;
      }

      if (result.code === "already_registered") {
        setMessage({ kind: "success", text: "You're already on the list." });
        return;
      }

      setMessage({
        kind: "error",
        text: result.message || "Something slipped. Try again."
      });
    } catch {
      setMessage({ kind: "error", text: "Something slipped. Try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="waitlist" onSubmit={onSubmit}>
      <div className="waitlist-row">
        <label className="sr-only" htmlFor={`email-${defaultSource}`}>
          Email address
        </label>
        <input
          id={`email-${defaultSource}`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button className="cta cta-primary" type="submit" disabled={loading}>
          {loading ? <Loader2 size={18} aria-hidden="true" /> : <Mail size={18} aria-hidden="true" />}
          {buttonLabel}
          {!loading && <ArrowRight size={18} aria-hidden="true" />}
        </button>
      </div>

      <label className="consent-row">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
        />
        <span>{siteConfig.consentText}</span>
      </label>

      <p className="form-message" data-kind={message.kind} aria-live="polite">
        {message.text}
      </p>
      <p className="form-note">We will only use your email for DropShadow launch and major game updates.</p>
    </form>
  );
}
