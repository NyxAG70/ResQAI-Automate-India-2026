import assert from "node:assert/strict";
import test from "node:test";
import { buildDashboard, DEMO_INCIDENTS } from "./dashboard";

test("builds an explicit operational summary from incident data", () => {
  const dashboard = buildDashboard(DEMO_INCIDENTS);
  const active = DEMO_INCIDENTS.filter(
    (incident) => incident.status !== "resolved",
  );
  const critical = active.filter(
    (incident) => incident.priorityLevel === "critical",
  );
  const affectedPopulation = active.reduce(
    (total, incident) => total + incident.peopleAffected,
    0,
  );
  const topPriority = [...active].sort(
    (a, b) => b.priorityScore - a.priorityScore,
  )[0];

  assert.match(dashboard.summary, new RegExp(`${active.length} active incidents`));
  assert.match(
    dashboard.summary,
    new RegExp(`${critical.length} critical incidents`),
  );
  assert.match(dashboard.summary, new RegExp(`${affectedPopulation} people`));
  assert.match(dashboard.summary, new RegExp(topPriority.title));
  assert.match(dashboard.summary, /access constraints/);
  assert.match(dashboard.summary, /Most urgent recommended action:/);
  assert.equal(dashboard.recommendations[0].targetLocation, topPriority.locationDescription);
});