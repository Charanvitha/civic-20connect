import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Globe2, Languages, MapPin, Trophy, UploadCloud } from "lucide-react";
import CaptureCamera from "@/components/app/CaptureCamera";
import CategoryPicker, { type CategoryKey } from "@/components/app/CategoryPicker";
import VoiceInput from "@/components/app/VoiceInput";
import Feed from "@/components/app/Feed";
import LeaderboardWidget from "@/components/app/LeaderboardWidget";
import Chatbot from "@/components/app/Chatbot";
import SOSFab from "@/components/app/SOSFab";

export default function Index() {
  const [image, setImage] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryKey>("pothole");
  const [description, setDescription] = useState("");
  const [lang, setLang] = useState("en");
  const [submitting, setSubmitting] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Acquire GPS on load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => setCoords(null),
        { enableHighAccuracy: true, timeout: 7000 },
      );
    }
  }, []);

  const canSubmit = useMemo(() => !!image && !!coords, [image, coords]);

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          description,
          imageDataUrl: image,
          location: coords,
          language: lang,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      const data = await res.json();
      alert(`Submitted! Issue ID: ${data.issue.id}`);
      setImage(null);
      setDescription("");
    } catch (e) {
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/60">
      <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:bg-background/70">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-600 to-green-600" />
            <span className="text-lg font-bold tracking-tight">CivicLens</span>
            <Badge variant="secondary" className="ml-2">Beta</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Languages className="h-4 w-4" />
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-transparent outline-none">
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>
        </div>
      </header>

      <main className="container pb-24">
        <section className="py-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Globe2 className="h-5 w-5 text-primary" /> Camera-First Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <CaptureCamera onCapture={setImage} />
                <div className="mt-4 grid gap-4">
                  <div>
                    <div className="mb-2 text-sm font-medium">Category</div>
                    <CategoryPicker value={category} onChange={setCategory} />
                  </div>
                  <div>
                    <div className="mb-2 text-sm font-medium">Describe (voice or text)</div>
                    <VoiceInput value={description} onChange={setDescription} placeholder="Describe the issue…" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      {coords ? (
                        <span>
                          {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                        </span>
                      ) : (
                        <span>Getting location…</span>
                      )}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1">
                      <UploadCloud className="h-4 w-4 text-green-600" /> One-tap submission
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button disabled={!canSubmit || submitting} onClick={submit} className="flex-1">
                      Submit Report
                    </Button>
                    <Button variant="outline" onClick={() => setImage(null)} disabled={!image}>
                      Retake
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-green-600" /> Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Stat label="Reports" value="—" />
                    <Stat label="Resolved" value="—" />
                    <Stat label="Points" value="—" />
                  </div>
                  <div className="mt-4">
                    <label className="text-sm text-muted-foreground">Name</label>
                    <Input placeholder="Citizen" disabled />
                  </div>
                </CardContent>
              </Card>
              <LeaderboardWidget />
            </div>
          </div>
        </section>

        <Feed />
        <Chatbot />
      </main>

      <SOSFab />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
