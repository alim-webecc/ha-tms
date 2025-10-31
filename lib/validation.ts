// lib/validation.ts
import { z } from "zod";

export const orderStatusEnum = z.enum(["offen", "in-bearbeitung", "geschlossen"]);

export const orderCreateSchema = z.object({
  status: orderStatusEnum.optional(),
  shipper: z.string().max(255).nullable().optional(),
  pickup_date: z.string().datetime().nullable().optional(),   // ISO-String
  dropoff_date: z.string().datetime().nullable().optional(),
  from_zip: z.string().max(20).nullable().optional(),
  to_zip: z.string().max(20).nullable().optional(),
  price_customer: z.number().finite().nullable().optional(),
  price_carrier: z.number().finite().nullable().optional(),
  ldm: z.number().finite().nullable().optional(),
  weight_kg: z.number().finite().nullable().optional(),
  remark: z.string().max(2000).nullable().optional(),
  carrier: z.string().max(255).nullable().optional(),
  tenantId: z.string().max(50).nullable().optional(),
  createdBy: z.string().max(100).nullable().optional(),
});

export const orderUpdateSchema = z.object({
  status: orderStatusEnum.optional(),
  remark: z.string().max(2000).optional(),
});

export const listQuerySchema = z.object({
  status: orderStatusEnum.optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  tenantId: z.string().max(50).default("TR"),
  fromZip: z.string().max(20).optional(),
  toZip: z.string().max(20).optional(),
});
