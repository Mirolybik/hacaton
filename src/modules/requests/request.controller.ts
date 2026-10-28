import type express from 'express';
import { asyncHandler } from '../../lib/async-handler';
import { HttpError } from '../../lib/http-error';
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
  type Actor,
} from './request.service';

function getActor(req: express.Request): Actor {
  const name = req.header('x-user-name');
  const role = req.header('x-user-role');

  if (!name || !role) {
    throw new HttpError(401, 'Нужны заголовки x-user-name и x-user-role');
  }

  if (role !== 'duty' && role !== 'engineer' && role !== 'director') {
    throw new HttpError(403, 'Неизвестная роль');
  }

  return { name: decodeURIComponent(name), role };
}

export const create = asyncHandler(async (req, res) => {
  const request = await createRequest(createRequestSchema.parse(req.body), getActor(req));
  res.status(201).json(request);
});

export const list = asyncHandler(async (req, res) => {
  const requests = await listRequests(listRequestsQuerySchema.parse(req.query), getActor(req));
  res.json(requests);
});

export const getById = asyncHandler(async (req, res) => {
  const request = await getRequest(req.params.id, getActor(req));
  res.json(request);
});

export const update = asyncHandler(async (req, res) => {
  const request = await updateRequest(
    req.params.id,
    updateRequestSchema.parse(req.body),
    getActor(req),
  );
  res.json(request);
});

export const take = asyncHandler(async (req, res) => {
  const request = await takeRequest(req.params.id, getActor(req));
  res.json(request);
});

export const stats = asyncHandler(async (req, res) => {
  res.json(await getStats(getActor(req)));
});
