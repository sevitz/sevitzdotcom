import type { APIRoute } from "astro";
import { site } from "../../data/site";

export const prerender = false;

interface RuntimeEnv {
  RESEND_API_KEY?: string;
  RESEND_FROM_ADDRESS?: string;
  TURNSTILE_SECRET_KEY?: string;
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function verifyTurnstile(secretKey: string, token: string, ip: string | null) {
  const form = new FormData();
  form.append("secret", secretKey);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as { runtime?: { env: RuntimeEnv } }).runtime?.env ?? ({} as RuntimeEnv);

  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const honeypot = String(formData.get("company") ?? "").trim();
  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");

  // Honeypot: bots fill hidden fields, humans never see them.
  if (honeypot) {
    return jsonResponse({ ok: true }, 200);
  }

  if (!name || !email || !message) {
    return jsonResponse({ ok: false, error: "Please fill in every field." }, 400);
  }

  if (env.TURNSTILE_SECRET_KEY) {
    if (!turnstileToken) {
      return jsonResponse({ ok: false, error: "Please complete the verification challenge." }, 400);
    }
    const verified = await verifyTurnstile(
      env.TURNSTILE_SECRET_KEY,
      turnstileToken,
      request.headers.get("CF-Connecting-IP")
    );
    if (!verified) {
      return jsonResponse({ ok: false, error: "Verification failed, please try again." }, 400);
    }
  }

  if (!env.RESEND_API_KEY) {
    return jsonResponse(
      { ok: false, error: "The contact form isn't configured yet — email adrian@sevitz.com directly for now." },
      503
    );
  }

  const from = env.RESEND_FROM_ADDRESS ?? "Sevitz.com Contact Form <contact@sevitz.com>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [site.contact.recipient],
      reply_to: email,
      subject: `New contact form message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });

  if (!res.ok) {
    return jsonResponse({ ok: false, error: "Couldn't send your message, please try again shortly." }, 502);
  }

  return jsonResponse({ ok: true }, 200);
};
