import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, SendHorizonal } from "lucide-react";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    { role: "bot", text: "Hi! I'm your Civic Assistant. Ask me how to report or check status." },
  ]);
  const [text, setText] = useState("");

  async function send() {
    if (!text.trim()) return;
    const user = text.trim();
    setMessages((m) => [...m, { role: "user", text: user }]);
    setText("");
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: user }),
    });
    const data = (await res.json()) as { reply: string };
    setMessages((m) => [...m, { role: "bot", text: data.reply }]);
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5" /> Chatbot</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 overflow-y-auto rounded-md border p-3 text-sm bg-card">
          {messages.map((m, idx) => (
            <div key={idx} className={m.role === "bot" ? "text-foreground" : "text-right text-primary"}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask about reporting, status, SOS…" />
          <Button onClick={send}><SendHorizonal className="h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}
