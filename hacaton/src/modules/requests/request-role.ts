export const REQUEST_ROLES = ['duty', 'engineer', 'director'] as const;

export type RequestRole = (typeof REQUEST_ROLES)[number];

export const REQUEST_ROLE_LABELS: Record<RequestRole, string> = {
  duty: 'Дежурный',
  engineer: 'Сервисный инженер',
  director: 'Технический директор',
};
