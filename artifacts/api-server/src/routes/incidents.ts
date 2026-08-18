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

const router: IRouter = Router();

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
        imageUrl: parsed.data.imageUrl ?? null,
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