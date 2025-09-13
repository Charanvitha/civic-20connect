import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { createIssue, listIssues, updateIssue } from "./routes/issues";
import { handleSos } from "./routes/sos";
import { handleChat } from "./routes/chat";
import { handleLeaderboard } from "./routes/leaderboard";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Health & demo
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app.get("/api/demo", handleDemo);

  // CivicLens API
  app.post("/api/report", createIssue);
  app.get("/api/issues", listIssues);
  app.patch("/api/issues/:id", updateIssue);

  app.post("/api/sos", handleSos);
  app.post("/api/chat", handleChat);

  return app;
}
