import { asyncHandler } from '../../lib/async-handler';
import { getActor } from './request-actor';
import {
  createRequestSchema,
  listRequestsQuerySchema,
  updateRequestSchema,
} from './request.schema';
import {
  createRequest,
  getRequest,
  getStats,
  listRequests,
  takeRequest,
  updateRequest,
} from './request.service';

export const create = asyncHandler(async (req, res) => {
  const actor = getActor(req);
  const input = createRequestSchema.parse(req.body);
  const request = await createRequest(input, actor);

  res.status(201).json(request);
});

export const list = asyncHandler(async (req, res) => {
  const actor = getActor(req);
  const query = listRequestsQuerySchema.parse(req.query);
  const requests = await listRequests(query, actor);

  res.json(requests);
});

export const getById = asyncHandler(async (req, res) => {
  const actor = getActor(req);
  const request = await getRequest(req.params.id, actor);

  res.json(request);
});

export const update = asyncHandler(async (req, res) => {
  const actor = getActor(req);
  const input = updateRequestSchema.parse(req.body);
  const request = await updateRequest(req.params.id, input, actor);

  res.json(request);
});

export const take = asyncHandler(async (req, res) => {
  const actor = getActor(req);
  const request = await takeRequest(req.params.id, actor);

  res.json(request);
});

export const stats = asyncHandler(async (req, res) => {
  const actor = getActor(req);
  const result = await getStats(actor);

  res.json(result);
});
