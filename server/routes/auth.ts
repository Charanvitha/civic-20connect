import { RequestHandler } from "express";
import { createOtp, verifyOtp } from "../auth";

export const sendOtp: RequestHandler = (req, res) => {
  const { phone } = req.body as { phone?: string };
  if (!phone || !/^\+?\d{10,15}$/.test(phone)) {
    res.status(400).json({ error: "Valid phone number is required" });
    return;
  }
  const code = createOtp(phone);
  // In production, send via SMS provider; here we return the code for demo purposes
  res.json({ ok: true, message: "OTP sent", code });
};

export const verifyOtpRoute: RequestHandler = (req, res) => {
  const { phone, code } = req.body as { phone?: string; code?: string };
  if (!phone || !code) {
    res.status(400).json({ error: "phone and code required" });
    return;
  }
  const ok = verifyOtp(phone, code);
  if (!ok) {
    res.status(401).json({ error: "Invalid or expired OTP" });
    return;
  }
  res.json({
    ok: true,
    token: `mock-${Buffer.from(phone).toString("base64")}`,
  });
};

export const verifyAadhaar: RequestHandler = (req, res) => {
  const { aadhaar, name } = req.body as { aadhaar?: string; name?: string };
  if (!aadhaar || !/^\d{12}$/.test(aadhaar)) {
    res.status(400).json({ error: "Aadhaar must be a 12-digit number" });
    return;
  }
  if (!name || name.length < 3) {
    res.status(400).json({ error: "Name is required" });
    return;
  }
  // Mock verification: pass if checksum-like rule holds (sum of digits % 10 === 0)
  const sum = aadhaar.split("").reduce((s, d) => s + Number(d), 0);
  const verified = sum % 10 === 0;
  if (!verified) {
    res.status(401).json({ ok: false, error: "Verification failed" });
    return;
  }
  res.json({ ok: true, aadhaar });
};
