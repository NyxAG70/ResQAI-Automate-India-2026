CREATE TYPE "public"."analysis_status" AS ENUM('pending', 'complete', 'failed');--> statement-breakpoint
CREATE TYPE "public"."disaster_type" AS ENUM('flood', 'earthquake', 'cyclone', 'landslide', 'fire', 'other');--> statement-breakpoint
CREATE TYPE "public"."incident_status" AS ENUM('awaiting_response', 'in_progress', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."priority_level" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TABLE "incidents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporter_name" text,
	"description" text NOT NULL,
	"disaster_type" "disaster_type" NOT NULL,
	"location_description" text NOT NULL,
	"latitude" real,
	"longitude" real,
	"people_affected" integer DEFAULT 0 NOT NULL,
	"image_url" text,
	"analysis_status" "analysis_status" DEFAULT 'pending' NOT NULL,
	"incident_type" text,
	"severity" real,
	"vulnerable_person" boolean,
	"immediate_threat" real,
	"accessibility" real,
	"time_criticality" real,
	"priority_score" real,
	"priority_level" "priority_level",
	"ai_summary" text,
	"status" "incident_status" DEFAULT 'awaiting_response' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
