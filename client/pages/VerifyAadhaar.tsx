import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function VerifyAadhaar() {
  const [aadhaar, setAadhaar] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { user, setUser } = useAuth();

  async function verify() {
    setLoading(true);
    const res = await fetch("/api/auth/aadhaar/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aadhaar: aadhaar.replace(/\s/g, ""), name }),
    });
    setLoading(false);
    if (!res.ok) return alert("Verification failed");
    setUser(user ? { ...user, aadhaarVerified: true } : null);
    nav("/");
  }

  return (
    <section className="py-12 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Aadhaar Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Demo rule: any 12 digits with digits-sum divisible by 10 passes
            (e.g., 000000000000).
          </p>
          <Input
            placeholder="Aadhaar Number (12 digits)"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
          />
          <Input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            onClick={verify}
            disabled={
              loading ||
              aadhaar.replace(/\s/g, "").length !== 12 ||
              name.length < 3
            }
          >
            Verify
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
