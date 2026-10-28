import { HttpError } from '../../lib/http-error';
import { REQUEST_ROLES, type RequestRole } from './request-role';

export type RequestActor = {
  name: string;
  role: RequestRole;
};

function decodeName(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function getActor(req: { header(name: string): string | undefined }): RequestActor {
  const name = req.header('x-user-name')?.trim();
  const role = req.header('x-user-role')?.trim();

  if (!name || !role) {
    throw new HttpError(401, 'actor_required');
  }

  if (!REQUEST_ROLES.includes(role as RequestRole)) {
    throw new HttpError(403, 'invalid_role');
  }

  return { name: decodeName(name), role: role as RequestRole };
}
