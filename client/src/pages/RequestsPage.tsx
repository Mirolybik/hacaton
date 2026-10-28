
export function RequestsPage() {
  return (
    <div className="dashboard">
      <h1>Заявки на обслуживание</h1>
      <p>Заявки на осмотр и ремонт оборудования ветропарка.</p>

      <section className="dashboard-panel">
        <h2>Список заявок</h2>

        <div className="empty-state">
          <h3>Заявки пока не загружены</h3>
          <p>Позже здесь появятся заявки из базы данных.</p>
        </div>
      </section>
    </div>
  );
}
