import assert from 'node:assert/strict';
import test from 'node:test';
import { DisasterType } from '@workspace/api-client-react';
import { reportFormSchema } from './report-schema';

const validReport = {
  reporterName: 'Test unit',
  description: 'Floodwater is blocking emergency access.',
  disasterType: DisasterType.flood,
  locationDescription: 'Validation zone',
  latitude: 28.6208,
  longitude: 77.241,
  peopleAffected: 4,
};

test('rejects a blank latitude as a field-level validation error', () => {
  const result = reportFormSchema.safeParse({
    ...validReport,
    latitude: '',
  });

  assert.equal(result.success, false);
  if (result.success) return;
  assert.deepEqual(result.error.issues[0]?.path, ['latitude']);
  assert.equal(
    result.error.issues[0]?.message,
    'Latitude is required and must be a valid number.',
  );
});

test('rejects a blank longitude as a field-level validation error', () => {
  const result = reportFormSchema.safeParse({
    ...validReport,
    longitude: '   ',
  });

  assert.equal(result.success, false);
  if (result.success) return;
  assert.deepEqual(result.error.issues[0]?.path, ['longitude']);
  assert.equal(
    result.error.issues[0]?.message,
    'Longitude is required and must be a valid number.',
  );
});

test('accepts and returns valid submitted GIS coordinates', () => {
  const result = reportFormSchema.parse({
    ...validReport,
    latitude: '28.6208',
    longitude: '77.241',
  });

  assert.equal(result.latitude, 28.6208);
  assert.equal(result.longitude, 77.241);
});