
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
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Панель управления ветропарком</h1>
          <p>Мониторинг оборудования и технического обслуживания</p>
        </div>

        <div className="api-status">
          <span className={
            health ? 'status-online' :
            error ? 'status-offline' :
            'status-loading'
          }>
            ●
          </span>

          {health && <span>API подключён</span>}
          {error && <span>{error}</span>}
          {!health && !error && <span>Проверка API...</span>}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Всего оборудования</span>
          <h2>—</h2>
          <p>Ветрогенераторы и компоненты</p>
        </div>

        <div className="stat-card">
          <span>Новые заявки</span>
          <h2>—</h2>
          <p>Ожидают обработки</p>
        </div>

        <div className="stat-card">
          <span>Заявки в работе</span>
          <h2>—</h2>
          <p>Назначены инженерам</p>
        </div>

        <div className="stat-card">
          <span>Выполнено</span>
          <h2>—</h2>
          <p>Завершённые работы</p>
        </div>
      </div>

      <div className="dashboard-content">
        <section className="dashboard-panel">
          <h2>Последние заявки</h2>
          <p className="panel-description">
            Здесь будут отображаться заявки на осмотр и ремонт.
          </p>

          <div className="empty-state">
            <h3>Список заявок</h3>
            <p>
              Данные появятся после подключения API заявок.
            </p>
          </div>
        </section>

        <section className="dashboard-panel">
          <h2>Оборудование</h2>
          <p className="panel-description">
            Контроль состояния оборудования ветропарка.
          </p>

          <div className="empty-state">
            <h3>Мониторинг оборудования</h3>
            <p>
              Данные появятся после подключения API оборудования.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
