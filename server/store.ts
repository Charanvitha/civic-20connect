import { Issue, LeaderboardEntry } from "@shared/api";

export const db = {
  issues: [] as Issue[],
  sos: [] as { id: string; type: string; createdAt: string }[],
  leaderboard: new Map<string, number>(),
};

export function awardPoints(user: string, points: number) {
  const current = db.leaderboard.get(user) ?? 0;
  db.leaderboard.set(user, current + points);
}

export function getLeaderboard(): LeaderboardEntry[] {
  return Array.from(db.leaderboard.entries())
    .map(([user, points]) => ({ user, points }))
    .sort((a, b) => b.points - a.points)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
}
