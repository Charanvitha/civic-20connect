import { RequestHandler } from "express";
import { SosRequest, SosResponse } from "@shared/api";
import { db } from "../store";

const genId = () => Math.random().toString(36).slice(2, 10);

export const handleSos: RequestHandler = (req, res) => {
  const body = req.body as SosRequest;
  if (!body?.location) {
    res.status(400).json({ error: "location is required" });
    return;
  }
  if (!body?.type) {
    res.status(400).json({ error: "type is required" });
    return;
  }
  const id = genId();
  db.sos.unshift({ id, type: body.type, createdAt: new Date().toISOString() });
  const resp: SosResponse = { ok: true, id };
  res.status(201).json(resp);
};
