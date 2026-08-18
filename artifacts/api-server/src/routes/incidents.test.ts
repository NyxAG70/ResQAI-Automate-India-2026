import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import test, { after, before } from "node:test";
import { inArray } from "drizzle-orm";
import app from "../app";
import { db, incidentsTable, pool } from "@workspace/db";

let server: Server;
let baseUrl = "";
const createdIncidentIds: string[] = [];

async function request(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

before(async () => {
  server = createServer(app);
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Test server did not expose an address");
  }

  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (createdIncidentIds.length > 0) {
    await db
      .delete(incidentsTable)
      .where(inArray(incidentsTable.id, createdIncidentIds));
  }

  await pool.end();
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("creates, retrieves, lists, and updates an incident", async () => {
  const createResponse = await request("/api/incidents", {
    method: "POST",
    body: JSON.stringify({
      reporterName: "Test Reporter",
      description:
        "Water has entered the ground floor and six people need assistance.",
      disasterType: "flood",
      locationDescription: "Block C, test neighborhood",
      latitude: 28.6139,
      longitude: 77.209,
      peopleAffected: 6,
    }),
  });

  assert.equal(createResponse.status, 201);
  const created = (await createResponse.json()) as {
    id: string;
    status: string;
    analysisStatus: string;
    peopleAffected: number;
  };
  createdIncidentIds.push(created.id);
  assert.equal(created.status, "awaiting_response");
  assert.equal(created.analysisStatus, "pending");
  assert.equal(created.peopleAffected, 6);

  const getResponse = await request(`/api/incidents/${created.id}`);
  assert.equal(getResponse.status, 200);
  const retrieved = (await getResponse.json()) as { id: string };
  assert.equal(retrieved.id, created.id);

  const listResponse = await request("/api/incidents");
  assert.equal(listResponse.status, 200);
  const listed = (await listResponse.json()) as Array<{ id: string }>;
  assert.ok(listed.some((incident) => incident.id === created.id));

  const updateResponse = await request(
    `/api/incidents/${created.id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status: "in_progress" }),
    },
  );
  assert.equal(updateResponse.status, 200);
  const updated = (await updateResponse.json()) as { status: string };
  assert.equal(updated.status, "in_progress");
});

test("rejects invalid incident input", async () => {
  const response = await request("/api/incidents", {
    method: "POST",
    body: JSON.stringify({
      description: "Too short",
      disasterType: "not-a-disaster",
      locationDescription: "",
      peopleAffected: -1,
    }),
  });

  assert.equal(response.status, 400);
  const body = (await response.json()) as { error: string };
  assert.match(body.error, /description|disasterType|locationDescription|peopleAffected/);
});