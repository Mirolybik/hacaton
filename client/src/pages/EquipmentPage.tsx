
export function EquipmentPage() {
  return (
    <div className="dashboard">
      <h1>Оборудование ветропарка</h1>
      <p>Мониторинг и учёт оборудования.</p>

      <section className="dashboard-panel">
        <h2>Список оборудования</h2>

        <div className="empty-state">
          <h3>Оборудование пока не загружено</h3>
          <p>Здесь будет отображаться информация из базы данных.</p>
        </div>
      </section>
    </div>
  );
}
