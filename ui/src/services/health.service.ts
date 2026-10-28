import { api } from '../lib/api';

export type HealthResponse = {
  status: 'ok';
};

export async function getHealth(): Promise<HealthResponse> {
  const { data } = await api.get<HealthResponse>('/health');
  return data;
}
