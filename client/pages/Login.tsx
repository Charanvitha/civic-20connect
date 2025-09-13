import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { setUser } = useAuth();

  async function sendOtp() {
    setLoading(true);
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    setLoading(false);
    if (!res.ok) return alert("Failed to send OTP");
    const data = await res.json();
    if (data.code) alert(`Demo OTP: ${data.code}`);
    setStage("otp");
  }

  async function verify() {
    setLoading(true);
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    setLoading(false);
    if (!res.ok) return alert("Invalid OTP");
    const data = await res.json();
    setUser({ phone, token: data.token, aadhaarVerified: false });
    nav("/verify-aadhaar");
  }

  return (
    <section className="py-12 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Login with Phone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stage === "phone" ? (
            <div className="space-y-3">
              <Input placeholder="Phone (e.g. +919876543210)" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Button onClick={sendOtp} disabled={loading || phone.length < 10}>Send OTP</Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Input placeholder="Enter OTP" value={code} onChange={(e) => setCode(e.target.value)} />
              <Button onClick={verify} disabled={loading || code.length < 4}>Verify OTP</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
