// lib/auth.ts — lightweight custom auth with signed JWT cookies
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "./db";

const COOKIE_NAME = "ps_admin_session";
const SECRET = process.env.NEXTAUTH_SECRET || "petstore-kuwait-secret-change-me-in-production-2026";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

function base64url(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function fromBase64url(s: string): Buffer {
  const padded = s + "=".repeat((4 - (s.length % 4)) % 4);
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function sign(payload: string): string {
  const h = createHmac("sha256", SECRET).update(payload).digest();
  return base64url(h);
}

function verifySignature(payload: string, sig: string): boolean {
  try {
    const expected = Buffer.from(sign(payload), "base64url");
    const actual = Buffer.from(sig, "base64url");
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

function makeToken(user: SessionUser): string {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = base64url(JSON.stringify({ ...user, exp }));
  const sig = sign(`${header}.${payload}`);
  return `${header}.${payload}.${sig}`;
}

function verifyToken(token: string): SessionUser | null {
  try {
    const [header, payload, sig] = token.split(".");
    if (!header || !payload || !sig) return null;
    if (!verifySignature(`${header}.${payload}`, sig)) return null;
    const data = JSON.parse(fromBase64url(payload).toString("utf-8"));
    if (typeof data.exp === "number" && data.exp < Math.floor(Date.now() / 1000)) return null;
    if (!data.id || !data.email || !data.role) return null;
    return { id: data.id, email: data.email, name: data.name, role: data.role };
  } catch {
    return null;
  }
}

export function scryptVerify(password: string, stored: string): boolean {
  try {
    const [algo, salt, hash] = stored.split("$");
    if (algo !== "scrypt") return false;
    const test = require("node:crypto").scryptSync(password, salt, 64);
    const target = Buffer.from(hash, "hex");
    return target.length === test.length && timingSafeEqual(test, target);
  } catch {
    return false;
  }
}

export async function authenticate(email: string, password: string): Promise<SessionUser | null> {
  const user = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  if (!user || !user.active) return null;
  if (!scryptVerify(password, user.passwordHash)) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: SessionUser) {
  const token = makeToken(user);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export const SESSION_COOKIE = COOKIE_NAME;
