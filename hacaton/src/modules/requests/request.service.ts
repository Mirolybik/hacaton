import { Op, type WhereOptions } from 'sequelize';
import { sequelize } from '../../db';
import { HttpError } from '../../lib/http-error';
import { Equipment } from '../equipment/equipment.model';
import type { RequestActor } from './request-actor';
import {
  RequestHistory,
  type RequestHistoryAction,
  type RequestHistoryValue,
} from './request.history';
import { Request } from './request.model';
import type {
  CreateRequestInput,
  ListRequestsQuery,
  UpdateRequestInput,
} from './request.schema';
import {
  canTransition,
  REQUEST_STATUSES,
  type RequestStatus,
} from './request-status';

const directorFields = new Set(['priority', 'dueAt', 'assignee']);
const engineerFields = new Set([
  'diagnostics',
  'workDescription',
  'waitingComment',
  'closingComment',
  'status',
]);

function toHistoryValue(value: unknown): RequestHistoryValue {
  if (value === undefined) {
    return null;
  }

  return JSON.parse(JSON.stringify(value)) as RequestHistoryValue;
}

function withOverdue(request: Request) {
  return {
    ...request.toJSON(),
    overdue: request.status !== 'done' && request.dueAt.getTime() < Date.now(),
  };
}

function assertCanView(request: Request, actor: RequestActor) {
  if (actor.role === 'engineer' && request.assignee && request.assignee !== actor.name) {
    throw new HttpError(403, 'request_not_assigned_to_you');
  }
}

function isSame(a: unknown, b: unknown) {
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  return a === b;
}

export async function createRequest(input: CreateRequestInput, actor: RequestActor) {
  if (actor.role !== 'duty') {
    throw new HttpError(403, 'only_duty_can_create');
  }

  const equipment = await Equipment.findByPk(input.equipmentId);
  if (!equipment) {
    throw new HttpError(404, 'equipment_not_found');
  }

  return sequelize.transaction(async (transaction) => {
    const request = await Request.create({ ...input, status: 'new' }, { transaction });

    await RequestHistory.create(
      {
        requestId: request.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: 'created',
        newValue: toHistoryValue(request.toJSON()),
      },
      { transaction },
    );

    return withOverdue(request);
  });
}

export async function listRequests(query: ListRequestsQuery, actor: RequestActor) {
  const where: WhereOptions & { [Op.or]?: Array<Record<string, unknown>> } = {};

  if (query.status) {
    where.status = query.status;
  }
  if (query.type) {
    where.type = query.type;
  }
  if (query.priority) {
    where.priority = query.priority;
  }
  if (query.assignee) {
    where.assignee = query.assignee;
  }
  if (query.equipmentId) {
    where.equipmentId = query.equipmentId;
  }

  if (query.overdue) {
    if (query.status === 'done') {
      return [];
    }

    where.dueAt = { [Op.lt]: new Date() };
    where.status = query.status ?? { [Op.ne]: 'done' };
  }

  if (actor.role === 'engineer') {
    where[Op.or] = [{ assignee: null }, { assignee: actor.name }];
  }

  const requests = await Request.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });

  return requests.map(withOverdue);
}

export async function getRequest(id: string, actor: RequestActor) {
  const request = await Request.findByPk(id, {
    include: [{ model: RequestHistory, as: 'history' }],
    order: [[{ model: RequestHistory, as: 'history' }, 'createdAt', 'ASC']],
  });

  if (!request) {
    throw new HttpError(404, 'request_not_found');
  }

  assertCanView(request, actor);

  return withOverdue(request);
}

export async function updateRequest(id: string, input: UpdateRequestInput, actor: RequestActor) {
  const request = await Request.findByPk(id);

  if (!request) {
    throw new HttpError(404, 'request_not_found');
  }

  assertCanView(request, actor);

  if (request.status === 'done') {
    throw new HttpError(409, 'request_already_done');
  }

  if (actor.role === 'engineer' && request.assignee !== actor.name) {
    throw new HttpError(403, 'request_not_assigned_to_you');
  }

  const allowedFields =
    actor.role === 'director'
      ? directorFields
      : actor.role === 'engineer'
        ? engineerFields
        : new Set<string>();

  for (const field of Object.keys(input)) {
    if (!allowedFields.has(field)) {
      throw new HttpError(403, `field_not_allowed:${field}`);
    }
  }

  const nextStatus = input.status;

  if (nextStatus && nextStatus !== request.status && !canTransition(request.status, nextStatus)) {
    throw new HttpError(409, `invalid_status_transition:${request.status}->${nextStatus}`);
  }

  if (
    nextStatus === 'in_progress' &&
    !(input.assignee !== undefined ? input.assignee : request.assignee)
  ) {
    throw new HttpError(400, 'assignee_required');
  }

  if (nextStatus === 'waiting_parts' && !(input.waitingComment ?? request.waitingComment)) {
    throw new HttpError(400, 'waiting_comment_required');
  }

  if (nextStatus === 'done') {
    if (!(input.closingComment ?? request.closingComment)) {
      throw new HttpError(400, 'closing_comment_required');
    }

    if (request.type === 'repair' && !(input.workDescription ?? request.workDescription)) {
      throw new HttpError(400, 'work_description_required');
    }
  }

  const updates: Record<string, unknown> = {};
  const changes: Array<{ field: string; oldValue: unknown; newValue: unknown }> = [];

  for (const [field, value] of Object.entries(input)) {
    if (value === undefined) {
      continue;
    }

    const oldValue = request.get(field);

    if (!isSame(oldValue, value)) {
      updates[field] = value;
      changes.push({ field, oldValue, newValue: value });
    }
  }

  if (changes.length === 0) {
    return withOverdue(request);
  }

  if (nextStatus === 'done') {
    updates.completedAt = new Date();
  }

  await sequelize.transaction(async (transaction) => {
    request.set(updates);
    await request.save({ transaction });

    for (const change of changes) {
      const action: RequestHistoryAction =
        change.field === 'status'
          ? 'status_changed'
          : change.field === 'assignee'
            ? 'assigned'
            : 'updated';

      await RequestHistory.create(
        {
          requestId: request.id,
          actorName: actor.name,
          actorRole: actor.role,
          action,
          field: change.field,
          oldValue: toHistoryValue(change.oldValue),
          newValue: toHistoryValue(change.newValue),
        },
        { transaction },
      );
    }
  });

  return withOverdue(request);
}

export async function takeRequest(id: string, actor: RequestActor) {
  if (actor.role !== 'engineer') {
    throw new HttpError(403, 'only_engineer_can_take');
  }

  const request = await Request.findByPk(id);

  if (!request) {
    throw new HttpError(404, 'request_not_found');
  }

  if (request.status === 'done') {
    throw new HttpError(409, 'request_already_done');
  }

  if (request.assignee && request.assignee !== actor.name) {
    throw new HttpError(409, 'request_already_assigned');
  }

  const oldAssignee = request.assignee;
  const oldStatus = request.status;

  await sequelize.transaction(async (transaction) => {
    request.set({
      assignee: actor.name,
      status: request.status === 'new' ? 'in_progress' : request.status,
    });
    await request.save({ transaction });

    if (oldAssignee !== actor.name) {
      await RequestHistory.create(
        {
          requestId: request.id,
          actorName: actor.name,
          actorRole: actor.role,
          action: 'assigned',
          field: 'assignee',
          oldValue: toHistoryValue(oldAssignee),
          newValue: toHistoryValue(actor.name),
        },
        { transaction },
      );
    }

    if (oldStatus !== request.status) {
      await RequestHistory.create(
        {
          requestId: request.id,
          actorName: actor.name,
          actorRole: actor.role,
          action: 'status_changed',
          field: 'status',
          oldValue: toHistoryValue(oldStatus),
          newValue: toHistoryValue(request.status),
        },
        { transaction },
      );
    }
  });

  return withOverdue(request);
}

export async function getStats(actor: RequestActor) {
  if (actor.role !== 'director') {
    throw new HttpError(403, 'only_director_can_view_stats');
  }

  const requests = await Request.findAll({
    attributes: ['status', 'assignee', 'dueAt'],
  });

  const byStatus = Object.fromEntries(
    REQUEST_STATUSES.map((status) => [status, 0]),
  ) as Record<RequestStatus, number>;

  const workload: Record<string, number> = {};
  let overdue = 0;

  for (const request of requests) {
    byStatus[request.status as RequestStatus] += 1;

    if (request.status !== 'done' && request.dueAt.getTime() < Date.now()) {
      overdue += 1;
    }

    if (request.status !== 'done') {
      const assignee = request.assignee ?? 'unassigned';
      workload[assignee] = (workload[assignee] ?? 0) + 1;
    }
  }

  return {
    total: requests.length,
    overdue,
    byStatus,
    workload,
  };
}
