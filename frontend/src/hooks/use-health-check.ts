import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../api/client';
import { getHealth, type HealthResponse } from '../api/health';

type HealthStatus = 'idle' | 'loading' | 'success' | 'error';

interface HealthState {
  status: HealthStatus;
  data?: HealthResponse;
  error?: ApiError;
  latencyMs?: number;
  checkedAt?: Date;
}

export function useHealthCheck() {
  const [state, setState] = useState<HealthState>({ status: 'idle' });
  const controllerRef = useRef<AbortController | null>(null);

  const check = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setState((prev) => ({ ...prev, status: 'loading', error: undefined }));

    const startedAt = performance.now();

    try {
      const data = await getHealth(controller.signal);
      if (controller.signal.aborted) return;

      setState({
        status: 'success',
        data,
        latencyMs: Math.round(performance.now() - startedAt),
        checkedAt: new Date(),
      });
    } catch (error) {
      if (controller.signal.aborted) return;

      setState((prev) => ({
        ...prev,
        status: 'error',
        error: error instanceof ApiError ? error : new ApiError('Неизвестная ошибка'),
        checkedAt: new Date(),
      }));
    }
  }, []);

  useEffect(() => {
    void check();
    return () => controllerRef.current?.abort();
  }, [check]);

  return { ...state, check };
}
