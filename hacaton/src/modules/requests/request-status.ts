export const REQUEST_STATUSES = [
  'new',
  'in_progress',
  'waiting_parts',
  'done',
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  waiting_parts: 'Ожидание ЗИП',
  done: 'Выполнено',
};

export const REQUEST_STATUS_TRANSITIONS: Record<RequestStatus, readonly RequestStatus[]> = {
  new: ['in_progress'],
  in_progress: ['waiting_parts', 'done'],
  waiting_parts: ['in_progress'],
  done: [],
};

export function canTransition(from: RequestStatus, to: RequestStatus): boolean {
  return REQUEST_STATUS_TRANSITIONS[from].includes(to);
}

export function getAllowedTransitions(status: RequestStatus): RequestStatus[] {
  return [...REQUEST_STATUS_TRANSITIONS[status]];
}
