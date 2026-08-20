import { calculatePriority, type PriorityLevel } from "./priority-engine";

export type DashboardIncident = {
  id: string;
  disasterType:
    | "flood"
    | "earthquake"
    | "cyclone"
    | "landslide"
    | "fire"
    | "other";
  title: string;
  description: string;
  locationDescription: string;
  latitude: number | null;
  longitude: number | null;
  severity: number;
  confidence: number;
  peopleAffected: number;
  source: string;
  timestamp: string;
  accessibility: number;
  status: "awaiting_response" | "in_progress" | "resolved";
  priorityScore: number;
  priorityLevel: PriorityLevel;
  incidentType: string;
  aiSummary: string;
  isDemo: boolean;
};

const scenarioStartedAt = Date.now();

function demoIncident(
  id: string,
  title: string,
  description: string,
  locationDescription: string,
  latitude: number,
  longitude: number,
  severity: number,
  peopleAffected: number,
  accessibility: number,
  source: string,
  incidentType: string,
  ageMinutes: number,
): DashboardIncident {
  const confidence =
    source === "Emergency Services"
      ? 0.96
      : source === "Field Officer"
        ? 0.91
        : 0.78;
  const priority = calculatePriority({
    severity,
    peopleAffected,
    immediateThreat: Math.min(10, severity + (peopleAffected > 20 ? 1 : 0)),
    accessibility,
    timeCriticality: Math.max(1, 10 - ageMinutes / 18),
  });

  return {
    id,
    title,
    description,
    locationDescription,
    latitude,
    longitude,
    severity,
    confidence,
    peopleAffected,
    source,
    timestamp: new Date(scenarioStartedAt - ageMinutes * 60_000).toISOString(),
    accessibility,
    status:
      priority.level === "critical" ? "awaiting_response" : "in_progress",
    priorityScore: priority.score,
    priorityLevel: priority.level,
    disasterType: "flood",
    incidentType,
    aiSummary: description,
    isDemo: true,
  };
}

export const DEMO_INCIDENTS: DashboardIncident[] = [
  demoIncident("demo-1", "Families trapped at Sector 4 apartments", "Six residents, including an elderly person, are trapped above rising floodwater. Main access is blocked.", "Sector 4, Yamuna Floodplain", 28.6139, 77.209, 9, 32, 2, "Emergency Services", "Rescue required", 12),
  demoIncident("demo-2", "Medical emergency at Yamuna camp", "Field team reports a diabetic patient and two children needing urgent evacuation from a low-lying relief camp.", "Yamuna Relief Camp", 28.6208, 77.241, 8, 18, 3, "Field Officer", "Medical emergency", 28),
  demoIncident("demo-3", "Bridge approach washed out", "Water has overtopped the eastern approach. Rescue vehicles cannot pass; alternate route remains open via Ring Road.", "Eastern Bridge Approach", 28.6015, 77.252, 8, 0, 1, "Satellite", "Blocked road", 44),
  demoIncident("demo-4", "School shelter nearing capacity", "Temporary shelter is operational with 74 displaced residents and limited drinking water.", "Government School Shelter", 28.6295, 77.217, 6, 74, 7, "Citizen", "Shelter capacity", 62),
  demoIncident("demo-5", "Roof collapse near Nizamuddin", "Partial building collapse reported after prolonged waterlogging; occupancy is unconfirmed.", "Nizamuddin East", 28.5892, 77.2505, 7, 12, 4, "Drone", "Damaged building", 36),
  demoIncident("demo-6", "Stranded commuters on underpass", "A bus is stalled in knee-deep water. Eight commuters are waiting for assistance.", "Pragati Maidan Underpass", 28.575, 77.23, 6, 8, 4, "Citizen", "People stranded", 75),
  demoIncident("demo-7", "Hospital access route flooded", "Ambulance access is restricted on the southern lane; hospital remains operational.", "LNJP Hospital South Access", 28.5672, 77.2431, 5, 0, 3, "Emergency Services", "Hospital access", 91),
  demoIncident("demo-8", "Power substation water ingress", "Sensor alert indicates rising water near a live substation. Isolation requested as a precaution.", "Civil Lines Substation", 28.6401, 77.1905, 5, 0, 5, "Sensor", "Infrastructure risk", 115),
  demoIncident("demo-9", "Open road reported at Lodhi Road", "Field officer confirms the northern evacuation corridor is currently passable.", "Lodhi Road Corridor", 28.5921, 77.2268, 2, 0, 9, "Field Officer", "Safe corridor", 135),
  demoIncident("demo-10", "Isolated household requests supplies", "Single household reports food shortage but no immediate medical threat.", "Mayur Vihar Extension", 28.6338, 77.26, 3, 4, 6, "Social Media", "Supply request", 150),
];

export function buildDashboard(incidents: DashboardIncident[]) {
  const active = incidents.filter((incident) => incident.status !== "resolved");
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
  const accessConstraints = active.filter((incident) => {
    const type = incident.incidentType.toLowerCase();
    return (
      type.includes("road") ||
      type.includes("access") ||
      incident.accessibility <= 3
    );
  });

  const recommendations = [...active]
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 4)
    .map((incident) => {
      const type = incident.incidentType.toLowerCase();
      const isMedical = type.includes("medical");
      const isAccess = type.includes("road") || type.includes("access");
      return {
        id: `rec-${incident.id}`,
        priority: incident.priorityLevel,
        action: isMedical
          ? "Dispatch medical unit"
          : isAccess
            ? "Clear and secure access route"
            : "Deploy rescue team",
        reason: `Priority score ${incident.priorityScore}/10; ${incident.peopleAffected} people affected; confidence ${Math.round(incident.confidence * 100)}%.`,
        targetLocation: incident.locationDescription,
        requiredResource: isMedical
          ? "Medical response team"
          : isAccess
            ? "Road clearance unit"
            : "Water rescue team",
        status: "pending",
      };
    });

  const mostUrgentRecommendation = recommendations[0];
  const summary = topPriority
    ? `Deterministic operational synthesis: ${active.length} active incidents include ${critical.length} critical incidents and represent ${affectedPopulation} people. ${topPriority.title} is the highest-priority zone at ${topPriority.priorityScore}/10 with ${Math.round(topPriority.confidence * 100)}% confidence. ${accessConstraints.length} access constraints are affecting response routes. Most urgent recommended action: ${mostUrgentRecommendation.action} at ${mostUrgentRecommendation.targetLocation}.`
    : "Deterministic operational synthesis: no active incidents are currently reported.";

  return {
    incidents,
    stats: {
      activeIncidents: active.length,
      criticalIncidents: critical.length,
      affectedPopulation,
      activeOperations: active.filter(
        (incident) => incident.status === "in_progress",
      ).length,
      incomingReports: incidents.length,
    },
    summary,
    recommendations,
    generatedAt: new Date().toISOString(),
    isDemo: incidents.some((incident) => incident.isDemo),
  };
}