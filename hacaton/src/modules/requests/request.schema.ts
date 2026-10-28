import { z } from 'zod';
import { REQUEST_PRIORITIES, REQUEST_TYPES } from './request.model';
import { REQUEST_STATUSES } from './request-status';

export const createRequestSchema = z.object({
  type: z.enum(REQUEST_TYPES),
  equipmentId: z.string().min(1).max(100),
  description: z.string().min(1),
  priority: z.enum(REQUEST_PRIORITIES).default('normal'),
  authorName: z.string().min(1).max(150),
  authorContact: z.string().min(1).max(200),
  dueAt: z.coerce.date(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;

export const updateRequestSchema = z
  .object({
    description: z.string().min(1).optional(),
    priority: z.enum(REQUEST_PRIORITIES).optional(),
    dueAt: z.coerce.date().optional(),
    assignee: z.string().min(1).max(150).nullable().optional(),
    diagnostics: z.string().nullable().optional(),
    workDescription: z.string().nullable().optional(),
    waitingComment: z.string().nullable().optional(),
    closingComment: z.string().nullable().optional(),
    status: z.enum(REQUEST_STATUSES).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'empty_update',
  });

export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;

const booleanString = z.enum(['true', 'false']).transform((value) => value === 'true');

export const listRequestsQuerySchema = z.object({
  status: z.enum(REQUEST_STATUSES).optional(),
  type: z.enum(REQUEST_TYPES).optional(),
  priority: z.enum(REQUEST_PRIORITIES).optional(),
  assignee: z.string().min(1).optional(),
  equipmentId: z.string().min(1).optional(),
  overdue: booleanString.optional(),
});

export type ListRequestsQuery = z.infer<typeof listRequestsQuerySchema>;
