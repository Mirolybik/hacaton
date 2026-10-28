import { Op } from 'sequelize';
import { HttpError } from '../../lib/http-error';
import { Equipment } from '../equipment/equipment.model';
import {
  REQUEST_STATUSES,
  Request,
  RequestHistory,
  STATUS_TRANSITIONS,
} from './request.model';
import type {
  CreateRequestInput,
  ListRequestsQuery,
  UpdateRequestInput,
} from './request.schema';

export type Role = 'duty' | 'engineer' | 'director';

export type Actor = {
  name: string;
  role: Role;
};

const DIRECTOR_FIELDS = ['priority', 'dueAt', 'assignee'];
const ENGINEER_FIELDS = [
  'status',
  'diagnostics',
  'workDescription',
  'waitingComment',
  'closingComment',
];

async function findRequest(id: string) {
  const request = await Request.findByPk(id);

  if (!request) {
    throw new HttpError(404, 'Заявка не найдена');
  }

  return request;
}

function addHistory(
  requestId: string,
  actor: Actor,
  action: string,
  field: string | null,
  oldValue: unknown,
  newValue: unknown,
) {
  return RequestHistory.create({
    requestId,
    userName: actor.name,
    userRole: actor.role,
    action,
    field,
    oldValue: oldValue == null ? null : String(oldValue),
    newValue: newValue == null ? null : String(newValue),
  });
}

export async function createRequest(data: CreateRequestInput, actor: Actor) {
  if (actor.role !== 'duty') {
    throw new HttpError(403, 'Создать заявку может только дежурный');
  }

  const equipment = await Equipment.findByPk(data.equipmentId);

  if (!equipment) {
    throw new HttpError(404, 'Оборудование не найдено');
  }

  const request = await Request.create(data);

  await addHistory(request.id, actor, 'created', null, null, 'Заявка создана');

  return request;
}

export function listRequests(query: ListRequestsQuery, actor: Actor) {
  const where: any = {};

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

  if (actor.role === 'engineer') {
    where[Op.or] = [{ assignee: null }, { assignee: actor.name }];
  }

  return Request.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });
}

export async function getRequest(id: string, actor: Actor) {
  const request = await Request.findByPk(id, {
    include: [{ model: RequestHistory, as: 'history' }],
  });

  if (!request) {
    throw new HttpError(404, 'Заявка не найдена');
  }

  if (actor.role === 'engineer' && request.assignee && request.assignee !== actor.name) {
    throw new HttpError(403, 'Заявка назначена другому инженеру');
  }

  return request;
}

export async function updateRequest(id: string, data: UpdateRequestInput, actor: Actor) {
  const request = await findRequest(id);

  if (actor.role === 'duty') {
    throw new HttpError(403, 'Дежурный не может менять заявку');
  }

  if (request.status === 'done') {
    throw new HttpError(409, 'Заявка уже выполнена');
  }

  if (actor.role === 'engineer' && request.assignee !== actor.name) {
    throw new HttpError(403, 'Заявка назначена другому инженеру');
  }

  const allowedFields = actor.role === 'director' ? DIRECTOR_FIELDS : ENGINEER_FIELDS;

  for (const field of Object.keys(data)) {
    if (!allowedFields.includes(field)) {
      throw new HttpError(403, `Нельзя менять поле ${field}`);
    }
  }

  if (data.status && data.status !== request.status) {
    if (!STATUS_TRANSITIONS[request.status].includes(data.status)) {
      throw new HttpError(409, `Нельзя перейти из "${request.status}" в "${data.status}"`);
    }

    if (data.status === 'in_progress' && !(data.assignee ?? request.assignee)) {
      throw new HttpError(400, 'Сначала назначьте исполнителя');
    }

    if (data.status === 'waiting_parts' && !(data.waitingComment ?? request.waitingComment)) {
      throw new HttpError(400, 'Напишите, каких запчастей не хватает');
    }

    if (data.status === 'done') {
      if (!(data.closingComment ?? request.closingComment)) {
        throw new HttpError(400, 'Добавьте комментарий о результате');
      }

      if (request.type === 'repair' && !(data.workDescription ?? request.workDescription)) {
        throw new HttpError(400, 'Опишите выполненные работы');
      }
    }
  }

  for (const [field, value] of Object.entries(data)) {
    if (value === undefined) {
      continue;
    }

    const oldValue = request.get(field);

    if (String(oldValue) === String(value)) {
      continue;
    }

    request.set(field, value);
    await addHistory(
      request.id,
      actor,
      field === 'status' ? 'status_changed' : 'updated',
      field,
      oldValue,
      value,
    );
  }

  if (data.status === 'done') {
    request.completedAt = new Date();
  }

  await request.save();

  return request;
}

export async function takeRequest(id: string, actor: Actor) {
  if (actor.role !== 'engineer') {
    throw new HttpError(403, 'Взять заявку может только сервисный инженер');
  }

  const request = await findRequest(id);

  if (request.status === 'done') {
    throw new HttpError(409, 'Заявка уже выполнена');
  }

  if (request.assignee && request.assignee !== actor.name) {
    throw new HttpError(409, 'Заявка уже назначена другому инженеру');
  }

  const oldAssignee = request.assignee;
  const oldStatus = request.status;

  request.assignee = actor.name;

  if (request.status === 'new') {
    request.status = 'in_progress';
  }

  await request.save();

  await addHistory(request.id, actor, 'assigned', 'assignee', oldAssignee, actor.name);

  if (oldStatus !== request.status) {
    await addHistory(request.id, actor, 'status_changed', 'status', oldStatus, request.status);
  }

  return request;
}

export async function getStats(actor: Actor) {
  if (actor.role !== 'director') {
    throw new HttpError(403, 'Статистику видит только технический директор');
  }

  const requests = await Request.findAll();

  const byStatus: Record<string, number> = {};
  const byAssignee: Record<string, number> = {};
  let overdue = 0;

  for (const status of REQUEST_STATUSES) {
    byStatus[status] = 0;
  }

  for (const request of requests) {
    byStatus[request.status] += 1;

    if (request.overdue) {
      overdue += 1;
    }

    if (request.status !== 'done') {
      const assignee = request.assignee ?? 'не назначен';
      byAssignee[assignee] = (byAssignee[assignee] ?? 0) + 1;
    }
  }

  return {
    total: requests.length,
    overdue,
    byStatus,
    byAssignee,
  };
}
