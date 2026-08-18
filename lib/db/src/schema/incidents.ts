import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const disasterTypeEnum = pgEnum("disaster_type", [
  "flood",
  "earthquake",
  "cyclone",
  "landslide",
  "fire",
  "other",
]);

export const analysisStatusEnum = pgEnum("analysis_status", [
  "pending",
  "complete",
  "failed",
]);

export const priorityLevelEnum = pgEnum("priority_level", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const incidentStatusEnum = pgEnum("incident_status", [
  "awaiting_response",
  "in_progress",
  "resolved",
]);

export const incidentsTable = pgTable("incidents", {
  id: uuid("id").primaryKey().defaultRandom(),
  reporterName: text("reporter_name"),
  description: text("description").notNull(),
  disasterType: disasterTypeEnum("disaster_type").notNull(),
  locationDescription: text("location_description").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  peopleAffected: integer("people_affected").notNull().default(0),
  imageUrl: text("image_url"),
  analysisStatus: analysisStatusEnum("analysis_status")
    .notNull()
    .default("pending"),
  incidentType: text("incident_type"),
  severity: real("severity"),
  vulnerablePerson: boolean("vulnerable_person"),
  immediateThreat: real("immediate_threat"),
  accessibility: real("accessibility"),
  timeCriticality: real("time_criticality"),
  priorityScore: real("priority_score"),
  priorityLevel: priorityLevelEnum("priority_level"),
  aiSummary: text("ai_summary"),
  status: incidentStatusEnum("status").notNull().default("awaiting_response"),
  isDemo: boolean("is_demo").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertIncidentSchema = createInsertSchema(incidentsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type Incident = typeof incidentsTable.$inferSelect;