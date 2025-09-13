import { randomInt } from "crypto";

export type OTPRecord = { code: string; expiresAt: number };

export const otpStore = new Map<string, OTPRecord>();

export function createOtp(phone: string): string {
  const code = String(randomInt(100000, 999999));
  const rec: OTPRecord = { code, expiresAt: Date.now() + 5 * 60 * 1000 };
  otpStore.set(phone, rec);
  return code;
}

export function verifyOtp(phone: string, code: string): boolean {
  const rec = otpStore.get(phone);
  if (!rec) return false;
  const ok = rec.code === code && Date.now() < rec.expiresAt;
  if (ok) otpStore.delete(phone);
  return ok;
}
