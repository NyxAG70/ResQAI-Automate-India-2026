import { DisasterType } from '@workspace/api-client-react';
import { z } from 'zod/v3';

const requiredCoordinate = (
  label: 'Latitude' | 'Longitude',
  min: number,
  max: number,
) =>
  z.preprocess(
    (value) => {
      if (
        value == null ||
        (typeof value === 'string' && value.trim() === '')
      ) {
        return undefined;
      }

      return typeof value === 'number' ? value : Number(value);
    },
    z
      .number({
        required_error: `${label} is required and must be a valid number.`,
        invalid_type_error: `${label} is required and must be a valid number.`,
      })
      .min(min, { message: `${label} must be between ${min} and ${max}.` })
      .max(max, { message: `${label} must be between ${min} and ${max}.` }),
  );

export const reportFormSchema = z.object({
  reporterName: z.string().optional(),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  disasterType: z.nativeEnum(DisasterType),
  locationDescription: z.string().min(1, {
    message: 'Location is required.',
  }),
  latitude: requiredCoordinate('Latitude', -90, 90),
  longitude: requiredCoordinate('Longitude', -180, 180),
  peopleAffected: z.coerce.number().min(0).default(0),
});

export type ReportFormValues = z.infer<typeof reportFormSchema>;