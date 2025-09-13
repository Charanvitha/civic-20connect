/**
 * Shared code between client and server
 * Types and helpers for the CivicLens app
 */

export interface DemoResponse {
  message: string;
}

export type IssueStatus = "reported" | "in_progress" | "resolved";

export type SosType = "fire" | "police" | "medical" | "disaster";

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface Issue {
  id: string;
  category: string;
  description?: string;
  imageDataUrl?: string;
  audioDataUrl?: string;
  location: GeoLocation;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
  reporterName?: string;
  beforeImage?: string;
  afterImage?: string;
  pointsAwarded?: number;
}

export interface CreateIssueRequest {
  category: string;
  description?: string;
  imageDataUrl?: string;
  audioDataUrl?: string;
  location: GeoLocation;
  language?: string;
}

export interface CreateIssueResponse {
  issue: Issue;
}

export interface ListIssuesResponse {
  issues: Issue[];
}

export interface UpdateIssueRequest {
  status?: IssueStatus;
  afterImage?: string;
}

export interface UpdateIssueResponse {
  issue: Issue;
}

export interface LeaderboardEntry {
  user: string;
  points: number;
  rank: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
}

export interface SosRequest {
  type: SosType;
  location: GeoLocation;
  note?: string;
}

export interface SosResponse {
  ok: boolean;
  id: string;
}

export interface ChatRequest {
  message: string;
  issueId?: string;
  language?: string;
}

export interface ChatResponse {
  reply: string;
}
