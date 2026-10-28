import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { Health, healthSchema } from '../api/schemas';

export function HomePage() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get('/health')
      .then((response) => setHealth(healthSchema.parse(response.data)))
      .catch(() => setError('API недоступен'));
  }, []);

  return (
    <section className="card">
      <h1>Панель управления</h1>
      {health && <p>Статус API: {health.status}</p>}
      {error && <p className="error">{error}</p>}
      {!health && !error && <p>Проверка соединения...</p>}
    </section>
  );
}
