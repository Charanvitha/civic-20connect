import { RequestHandler } from "express";
import { ChatRequest, ChatResponse } from "@shared/api";

export const handleChat: RequestHandler = (req, res) => {
  const body = req.body as ChatRequest;
  const msg = (body.message || "").toLowerCase();
  let reply = "I can help you report issues, track status, and trigger SOS. Say 'report pothole', 'status <id>', or 'sos'.";
  if (msg.includes("report")) reply = "To report: capture a photo, choose a category, add a short note, and tap Submit.";
  else if (msg.startsWith("status")) reply = "Open Explore to see live status. Officials update from Reported → In-progress → Resolved.";
  else if (msg.includes("sos")) reply = "Tap the red SOS button for Fire/Police/Medical/Disaster. Your GPS will be shared.";
  else if (msg.includes("points") || msg.includes("leaderboard")) reply = "Earn points for valid reports and bonuses on verified resolutions. Check the Leaderboard section.";
  const resp: ChatResponse = { reply };
  res.json(resp);
};
