import { RequestHandler } from "express";
import { LeaderboardResponse } from "@shared/api";
import { getLeaderboard } from "../store";

export const handleLeaderboard: RequestHandler = (_req, res) => {
  const leaderboard = getLeaderboard();
  const resp: LeaderboardResponse = { leaderboard };
  res.json(resp);
};
