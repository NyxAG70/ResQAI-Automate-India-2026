export type PriorityFactors = {
  severity: number;
  peopleAffected: number;
  immediateThreat: number;
  accessibility: number;
  timeCriticality: number;
};

export type PriorityLevel = "low" | "medium" | "high" | "critical";

export const PRIORITY_WEIGHTS = {
  severity: 0.3,
  peopleAffected: 0.25,
  immediateThreat: 0.2,
  timeCriticality: 0.15,
  accessibility: 0.1,
} as const;

export const PEOPLE_AFFECTED_NORMALIZATION_CAP = 10;

function assertFactor(value: number, field: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 10) {
    throw new RangeError(`${field} must be a number between 0 and 10`);
  }
}

export function normalizePeopleAffected(peopleAffected: number): number {
  if (!Number.isFinite(peopleAffected) || peopleAffected < 0) {
    throw new RangeError("peopleAffected must be a non-negative number");
  }

  return Math.min(peopleAffected, PEOPLE_AFFECTED_NORMALIZATION_CAP);
}

export function calculatePriorityScore(factors: PriorityFactors): number {
  assertFactor(factors.severity, "severity");
  assertFactor(factors.immediateThreat, "immediateThreat");
  assertFactor(factors.accessibility, "accessibility");
  assertFactor(factors.timeCriticality, "timeCriticality");

  const peopleAffected = normalizePeopleAffected(factors.peopleAffected);
  const score =
    PRIORITY_WEIGHTS.severity * factors.severity +
    PRIORITY_WEIGHTS.peopleAffected * peopleAffected +
    PRIORITY_WEIGHTS.immediateThreat * factors.immediateThreat +
    PRIORITY_WEIGHTS.timeCriticality * factors.timeCriticality +
    PRIORITY_WEIGHTS.accessibility * factors.accessibility;

  return Math.round(score * 100) / 100;
}

/**
 * Prototype thresholds: boundaries are intentionally explicit so a score of
 * 3 is medium, 5 is high, and 7.5 is critical.
 */
export function getPriorityLevel(score: number): PriorityLevel {
  if (!Number.isFinite(score) || score < 0 || score > 10) {
    throw new RangeError("score must be a number between 0 and 10");
  }

  if (score < 3) {
    return "low";
  }

  if (score < 5) {
    return "medium";
  }

  if (score < 7.5) {
    return "high";
  }

  return "critical";
}

export function calculatePriority(
  factors: PriorityFactors,
): { score: number; level: PriorityLevel } {
  const score = calculatePriorityScore(factors);
  return { score, level: getPriorityLevel(score) };
}