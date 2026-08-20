import { desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  CreateIncidentBody,
  CreateIncidentResponse,
  GetIncidentParams,
  GetIncidentResponse,
  ListIncidentsResponse,
  UpdateIncidentStatusBody,
  UpdateIncidentStatusParams,
  UpdateIncidentStatusResponse,
} from "@workspace/api-zod";
import { db, incidentsTable } from "@workspace/db";
import { buildDashboard, DEMO_INCIDENTS } from "../services/dashboard";
import { calculatePriority } from "../services/priority-engine";

const router: IRouter = Router();

router.get("/dashboard", async (req, res): Promise<void> => {
  try {
    const records = await db.select().from(incidentsTable).orderBy(desc(incidentsTable.createdAt));
    const incidents = records.length ? records.map((i) => ({ ...i, confidence: 0.9, title: i.incidentType ?? i.locationDescription, timestamp: i.createdAt.toISOString(), severity: i.severity ?? 0, accessibility: i.accessibility ?? 5, priorityScore: i.priorityScore ?? 0, priorityLevel: i.priorityLevel ?? "low", source: i.reporterName ?? "Citizen", aiSummary: i.aiSummary ?? i.description, isDemo: i.isDemo })) : DEMO_INCIDENTS;
    res.json(buildDashboard(incidents as any));
  } catch (error) {
    req.log.error({ err: error }, "Failed to build dashboard");
    res.json(buildDashboard(DEMO_INCIDENTS));
  }
});

router.get("/incidents", async (req, res): Promise<void> => {
  try {
    const incidents = await db
      .select()
      .from(incidentsTable)
      .orderBy(desc(incidentsTable.createdAt));

    res.json(ListIncidentsResponse.parse(incidents));
  } catch (error) {
    req.log.error({ err: error }, "Failed to list incidents");
    res.status(500).json({ error: "Unable to retrieve incidents" });
  }
});

router.post("/incidents", async (req, res): Promise<void> => {
  const parsed = CreateIncidentBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.flatten() }, "Invalid incident input");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const severity = Math.min(10, parsed.data.peopleAffected >= 25 ? 9 : parsed.data.peopleAffected >= 10 ? 7 : parsed.data.peopleAffected > 0 ? 5 : 3);
    const immediateThreat = parsed.data.peopleAffected > 0 ? 7 : 3;
    const accessibility = parsed.data.latitude == null ? 5 : 6;
    const priority = calculatePriority({ severity, peopleAffected: parsed.data.peopleAffected, immediateThreat, accessibility, timeCriticality: 8 });
    const [incident] = await db
      .insert(incidentsTable)
      .values({
        reporterName: parsed.data.reporterName ?? null,
        description: parsed.data.description,
        disasterType: parsed.data.disasterType,
        locationDescription: parsed.data.locationDescription,
        latitude: parsed.data.latitude ?? null,
        longitude: parsed.data.longitude ?? null,
        peopleAffected: parsed.data.peopleAffected,
        severity,
        immediateThreat,
        accessibility,
        timeCriticality: 8,
        priorityScore: priority.score,
        priorityLevel: priority.level,
        imageUrl: parsed.data.imageUrl ?? null,
        aiSummary: "Report received and scored deterministically from submitted details.",
      })
      .returning();

    res.status(201).json(CreateIncidentResponse.parse(incident));
  } catch (error) {
    req.log.error({ err: error }, "Failed to create incident");
    res.status(500).json({ error: "Unable to create incident" });
  }
});

router.get("/incidents/:id", async (req, res): Promise<void> => {
  const params = GetIncidentParams.safeParse(req.params);
  if (!params.success) {
    req.log.warn({ errors: params.error.flatten() }, "Invalid incident ID");
    res.status(400).json({ error: params.error.message });
    return;
  }

  try {
    const [incident] = await db
      .select()
      .from(incidentsTable)
      .where(eq(incidentsTable.id, params.data.id));

    if (!incident) {
      res.status(404).json({ error: "Incident not found" });
      return;
    }

    res.json(GetIncidentResponse.parse(incident));
  } catch (error) {
    req.log.error({ err: error, incidentId: params.data.id }, "Failed to get incident");
    res.status(500).json({ error: "Unable to retrieve incident" });
  }
});

router.patch("/incidents/:id/status", async (req, res): Promise<void> => {
  const params = UpdateIncidentStatusParams.safeParse(req.params);
  if (!params.success) {
    req.log.warn({ errors: params.error.flatten() }, "Invalid incident ID");
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = UpdateIncidentStatusBody.safeParse(req.body);
  if (!body.success) {
    req.log.warn({ errors: body.error.flatten() }, "Invalid incident status");
    res.status(400).json({ error: body.error.message });
    return;
  }

  try {
    const [incident] = await db
      .update(incidentsTable)
      .set({
        status: body.data.status,
        updatedAt: new Date(),
      })
      .where(eq(incidentsTable.id, params.data.id))
      .returning();

    if (!incident) {
      res.status(404).json({ error: "Incident not found" });
      return;
    }

    res.json(UpdateIncidentStatusResponse.parse(incident));
  } catch (error) {
    req.log.error(
      { err: error, incidentId: params.data.id },
      "Failed to update incident status",
    );
    res.status(500).json({ error: "Unable to update incident status" });
  }
});

export default router;