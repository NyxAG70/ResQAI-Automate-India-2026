import assert from "node:assert/strict";
import test from "node:test";
import {
  calculatePriority,
  calculatePriorityScore,
  getPriorityLevel,
  normalizePeopleAffected,
} from "./priority-engine";

test("calculates the weighted prototype score", () => {
  const result = calculatePriority({
    severity: 8,
    peopleAffected: 6,
    immediateThreat: 8,
    accessibility: 3,
    timeCriticality: 8,
  });

  assert.equal(result.score, 7);
  assert.equal(result.level, "high");
});

test("caps people affected at the normalized maximum", () => {
  assert.equal(normalizePeopleAffected(25), 10);
  assert.equal(
    calculatePriorityScore({
      severity: 0,
      peopleAffected: 25,
      immediateThreat: 0,
      accessibility: 0,
      timeCriticality: 0,
    }),
    2.5,
  );
});

test("assigns priority levels at the documented boundaries", () => {
  assert.equal(getPriorityLevel(2.99), "low");
  assert.equal(getPriorityLevel(3), "medium");
  assert.equal(getPriorityLevel(4.99), "medium");
  assert.equal(getPriorityLevel(5), "high");
  assert.equal(getPriorityLevel(7.49), "high");
  assert.equal(getPriorityLevel(7.5), "critical");
});

test("rejects invalid factor values", () => {
  assert.throws(
    () =>
      calculatePriorityScore({
        severity: 11,
        peopleAffected: 1,
        immediateThreat: 1,
        accessibility: 1,
        timeCriticality: 1,
      }),
    /severity must be a number between 0 and 10/,
  );
});