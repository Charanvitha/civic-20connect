import { RequestHandler } from "express";
import {
  CreateIssueRequest,
  CreateIssueResponse,
  ListIssuesResponse,
  UpdateIssueRequest,
  UpdateIssueResponse,
  Issue,
} from "@shared/api";
import { db, awardPoints } from "../store";

const genId = () => Math.random().toString(36).slice(2, 10);

export const createIssue: RequestHandler = (req, res) => {
  const body = req.body as CreateIssueRequest;
  if (!body?.location || typeof body.location.lat !== "number" || typeof body.location.lng !== "number") {
    res.status(400).json({ error: "location.lat and location.lng are required" });
    return;
  }
  if (!body.category) {
    res.status(400).json({ error: "category is required" });
    return;
  }
  const now = new Date().toISOString();
  const issue: Issue = {
    id: genId(),
    category: body.category,
    description: body.description?.slice(0, 2000),
    imageDataUrl: body.imageDataUrl,
    audioDataUrl: body.audioDataUrl,
    location: body.location,
    status: "reported",
    createdAt: now,
    updatedAt: now,
    reporterName: "Citizen",
    pointsAwarded: 0,
  };
  db.issues.unshift(issue);
  // Award base points for reporting
  awardPoints(issue.reporterName ?? "Citizen", 10);
  issue.pointsAwarded = 10;
  const resp: CreateIssueResponse = { issue };
  res.status(201).json(resp);
};

export const listIssues: RequestHandler = (req, res) => {
  const { status, category } = req.query as { status?: string; category?: string };
  let issues = db.issues;
  if (status) issues = issues.filter((i) => i.status === status);
  if (category) issues = issues.filter((i) => i.category === category);
  const resp: ListIssuesResponse = { issues };
  res.json(resp);
};

export const updateIssue: RequestHandler = (req, res) => {
  const { id } = req.params as { id: string };
  const body = req.body as UpdateIssueRequest;
  const issue = db.issues.find((i) => i.id === id);
  if (!issue) {
    res.status(404).json({ error: "Issue not found" });
    return;
  }
  if (body.status) issue.status = body.status;
  if (body.afterImage) issue.afterImage = body.afterImage;
  issue.updatedAt = new Date().toISOString();
  if (issue.status === "resolved" && (issue.pointsAwarded ?? 0) < 30) {
    // bonus points when resolved with proof
    awardPoints(issue.reporterName ?? "Citizen", 20);
    issue.pointsAwarded = (issue.pointsAwarded ?? 0) + 20;
  }
  const resp: UpdateIssueResponse = { issue };
  res.json(resp);
};
