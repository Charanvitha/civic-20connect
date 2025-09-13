import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function VoiceInput({ value, onChange, placeholder }: Props) {
  const recRef = useRef<any>(null);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SR) {
      setSupported(true);
      const rec = new SR();
      rec.lang = "en-IN";
      rec.interimResults = true;
      rec.continuous = false;
      rec.onresult = (e: any) => {
        const transcript = Array.from(e.results)
          .map((r: any) => r[0]?.transcript)
          .join(" ");
        onChange(transcript);
      };
      rec.onend = () => setListening(false);
      recRef.current = rec;
    }
  }, [onChange]);

  function toggle() {
    if (!supported) return;
    if (!listening) {
      try {
        recRef.current.start();
        setListening(true);
      } catch {}
    } else {
      try {
        recRef.current.stop();
      } catch {}
      setListening(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={toggle}
          variant={listening ? "destructive" : "secondary"}
        >
          {listening ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}{" "}
          {listening ? "Stop" : "Voice"}
        </Button>
        {!supported && (
          <span className="text-xs text-muted-foreground">
            Voice input not supported on this browser.
          </span>
        )}
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
