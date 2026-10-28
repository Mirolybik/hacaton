import { api } from './client';

export interface HealthResponse {
  status: 'ok';
}

export async function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const { data } = await api.get<HealthResponse>('/health', { signal });
  return data;
}
