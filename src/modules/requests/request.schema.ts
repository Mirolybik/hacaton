import { z } from "zod";
import {
  REQUEST_PRIORITIES,
  REQUEST_STATUSES,
  REQUEST_TYPES,
} from "./domains/request-info.types";

export const createRequestSchema = z.object({
  type: z.enum(REQUEST_TYPES),
  equipmentId: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(REQUEST_PRIORITIES).default("normal"),
  authorName: z.string().min(1),
  authorContact: z.string().min(1),
  dueAt: z.coerce.date(),
});

export const updateRequestSchema = z
  .object({
    description: z.string().min(1),
    priority: z.enum(REQUEST_PRIORITIES),
    dueAt: z.coerce.date(),
    assignee: z.string().min(1).nullable(),
    diagnostics: z.string().nullable(),
    workDescription: z.string().nullable(),
    waitingComment: z.string().nullable(),
    closingComment: z.string().nullable(),
    status: z.enum(REQUEST_STATUSES),
  })
  .partial();

export const listRequestsQuerySchema = z.object({
  status: z.enum(REQUEST_STATUSES).optional(),
  type: z.enum(REQUEST_TYPES).optional(),
  priority: z.enum(REQUEST_PRIORITIES).optional(),
  assignee: z.string().optional(),
  equipmentId: z.string().optional(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;
export type ListRequestsQuery = z.infer<typeof listRequestsQuerySchema>;
