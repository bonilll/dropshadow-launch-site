import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";

type SubscribePayload = {
  email?: unknown;
  source?: unknown;
  consent?: unknown;
  consentVersion?: unknown;
  consentText?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

function normalizeSource(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return "unknown";
  }

  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .slice(0, 80);
}

async function parseBrevoError(response: Response) {
  try {
    return (await response.json()) as { code?: string; message?: string };
  } catch {
    return { message: "Brevo request failed." };
  }
}

export async function POST(request: NextRequest) {
  let payload: SubscribePayload;

  try {
    payload = (await request.json()) as SubscribePayload;
  } catch {
    return json(400, { message: "Invalid request body." });
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const source = normalizeSource(payload.source);
  const consent = payload.consent === true;
  const consentVersion =
    typeof payload.consentVersion === "string" ? payload.consentVersion : siteConfig.consentVersion;
  const consentText =
    typeof payload.consentText === "string" ? payload.consentText : siteConfig.consentText;

  if (!emailPattern.test(email)) {
    return json(400, { code: "invalid_email", message: "That does not look like an email." });
  }

  if (!consent) {
    return json(400, {
      code: "missing_consent",
      message: "Please agree to receive DropShadow launch updates before joining."
    });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listIdRaw = process.env.BREVO_LIST_ID;
  const listId = listIdRaw ? Number.parseInt(listIdRaw, 10) : undefined;

  if (!apiKey) {
    return json(503, {
      code: "waitlist_not_configured",
      message: "The launch list is not configured yet."
    });
  }

  const createdAt = new Date().toISOString();
  const brevoBody: Record<string, unknown> = {
    email,
    updateEnabled: false,
    attributes: {
      SOURCE: source,
      CONSENT_VERSION: consentVersion,
      CONSENT_TEXT: consentText,
      CONSENT_AT: createdAt
    }
  };

  if (typeof listId === "number" && Number.isFinite(listId)) {
    brevoBody.listIds = [listId];
  }

  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": apiKey
    },
    body: JSON.stringify(brevoBody)
  });

  if (response.ok) {
    return json(200, { message: "You're in. The Shadow will know." });
  }

  const error = await parseBrevoError(response);

  if (response.status === 400 && error.code === "duplicate_parameter") {
    return json(409, { code: "already_registered", message: "You're already on the list." });
  }

  return json(502, {
    code: "brevo_error",
    message: "Something slipped. Try again.",
    detail: error.message
  });
}

