import { cookies } from "next/headers";

const cookieName = "hive_admin";
const maxAge = 60 * 60 * 12;
const attempts = new Map<string, { count: number; until: number }>();

function secret() { return process.env.ADMIN_SESSION_SECRET || ""; }
function pin() { return process.env.ADMIN_PIN || ""; }
export function adminConfigured() { return /^\d{6}$/.test(pin()) && secret().length >= 32; }

async function sign(value: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

function equal(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function canAttempt(identifier: string) {
  const entry = attempts.get(identifier);
  if (!entry) return true;
  if (Date.now() > entry.until) { attempts.delete(identifier); return true; }
  return entry.count < 5;
}
export function recordAttempt(identifier: string, success: boolean) {
  if (success) { attempts.delete(identifier); return; }
  const entry = attempts.get(identifier);
  attempts.set(identifier, { count: (entry?.count || 0) + 1, until: Date.now() + 15 * 60 * 1000 });
}
export function checkPin(value: string) { return /^\d{6}$/.test(value) && equal(value, pin()); }

export async function createAdminSession() {
  const timestamp = String(Date.now());
  const signature = await sign(timestamp);
  (await cookies()).set(cookieName, `${timestamp}.${signature}`, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "strict", path: "/", maxAge
  });
}
export async function clearAdminSession() { (await cookies()).delete(cookieName); }
export async function isAdmin() {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(cookieName)?.value;
  if (!value) return false;
  const [timestamp, signature] = value.split(".");
  if (!timestamp || !signature || !/^\d+$/.test(timestamp)) return false;
  if (Date.now() - Number(timestamp) > maxAge * 1000 || Number(timestamp) > Date.now()) return false;
  return equal(signature, await sign(timestamp));
}
