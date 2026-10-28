
import { useState, type FormEvent } from 'react';

export function CreateRequestPage() {
  const [equipmentId, setEquipmentId] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('inspection');
  const [priority, setPriority] = useState('normal');
  const [message, setMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('Форма заполнена. Подключение к API будет следующим этапом.');
  }

  return (
    <div className="dashboard">
      <h1>Создание заявки</h1>
      <p>Заполните сведения о техническом обслуживании.</p>

      <section className="dashboard-panel request-form-panel">
        <form className="request-form" onSubmit={handleSubmit}>
          <label htmlFor="type">Тип заявки</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="inspection">Осмотр</option>
            <option value="repair">Ремонт</option>
          </select>

          <label htmlFor="equipment">Оборудование</label>
          <input
            id="equipment"
            value={equipmentId}
            onChange={(e) => setEquipmentId(e.target.value)}
            placeholder="Идентификатор оборудования"
            required
          />

          <label htmlFor="priority">Приоритет</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Низкий</option>
            <option value="normal">Обычный</option>
            <option value="high">Высокий</option>
          </select>

          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <button type="submit" className="primary-button">
            Проверить заполнение
          </button>
        </form>

        {message && <p className="form-message">{message}</p>}
      </section>
    </div>
  );
}
