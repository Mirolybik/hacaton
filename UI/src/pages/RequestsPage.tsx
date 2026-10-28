import { useEffect, useState } from "react";
import { createRequest, getEquipment, getRequests } from "../api";
import { STATUSES } from "../consts";
import RequestDetailPage from "./RequestDetailPage";

type CreateForm = {
  type: "inspection" | "repair";
  equipmentId: string;
  description: string;
  priority: "low" | "normal" | "high";
  authorName: string;
  authorContact: string;
  dueAt: string;
};

function makeCreateForm(authorName: string): CreateForm {
  const due = new Date(Date.now() + 24 * 60 * 60 * 1000);
  due.setMinutes(due.getMinutes() - due.getTimezoneOffset());

  return {
    type: "inspection",
    equipmentId: "",
    description: "",
    priority: "normal",
    authorName,
    authorContact: "",
    dueAt: due.toISOString().slice(0, 16),
  };
}

function RequestsPage({ user, openId, onOpen, onBye }) {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateForm>(() => makeCreateForm(user.name || ""));
  const [equipment, setEquipment] = useState<{ equipmentId: string; equipmentName: string }[]>([]);
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const [createBusy, setCreateBusy] = useState(false);
  const [createError, setCreateError] = useState("");

  const load = async (status?: string) => {
    setError("");
    try {
      const data = await getRequests(status || undefined);
      setRows(data);
    } catch (err) {
      setError(err.message);
      setRows([]);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const submitCreate = async (event) => {
    event.preventDefault();
    setCreateError("");

    const due = new Date(createForm.dueAt);
    if (Number.isNaN(due.getTime())) {
      setCreateError("Укажи корректный срок выполнения.");
      return;
    }

    setCreateBusy(true);
    try {
      await createRequest({
        ...createForm,
        equipmentId: createForm.equipmentId.trim(),
        description: createForm.description.trim(),
        authorName: createForm.authorName.trim(),
        authorContact: createForm.authorContact.trim(),
        dueAt: due.toISOString(),
      });
      setCreateForm(makeCreateForm(user.name || ""));
      setCreateOpen(false);
      setFilter("");
      await load("");
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Не удалось создать заявку.");
    } finally {
      setCreateBusy(false);
    }
  };


  useEffect(() => {
    if (!createOpen || user.role !== "duty") return;
    let cancelled = false;
    setEquipmentLoading(true);
    setCreateError("");

    getEquipment()
      .then((items) => {
        if (!cancelled) setEquipment(Array.isArray(items) ? items : []);
      })
      .catch((err) => {
        if (!cancelled) setCreateError(err instanceof Error ? err.message : "Не удалось загрузить оборудование.");
      })
      .finally(() => {
        if (!cancelled) setEquipmentLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [createOpen, user.role]);

  if (openId) {
    const handleBack = () => {
      onOpen(null);
      load(filter);
    };

    return <RequestDetailPage id={openId} user={user} onBack={handleBack} />;
  }

  const changeFilter = (e) => {
    setFilter(e.target.value);
    load(e.target.value);
  };

  return (
    <div className="page">
      <header className="topbar">
        <h1>заявки</h1>
        <div className="topbar-right">
          <span className="muted">
            {user.name} ({user.role})
          </span>
          <button onClick={onBye}>выйти</button>
        </div>
      </header>

      <div className="toolbar">
        <label>
          статус:{" "}
          <select value={filter} onChange={changeFilter}>
            <option value="">все</option>
            {Object.keys(STATUSES).map((s) => (
              <option key={s} value={s}>
                {STATUSES[s]}
              </option>
            ))}
          </select>
        </label>
        <button onClick={() => load(filter)}>обновить</button>
        {user.role === "duty" && (
          <button type="button" onClick={() => { setCreateError(""); setCreateOpen((value) => !value); }}>
            {createOpen ? "скрыть форму" : "создать заявку"}
          </button>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {createOpen && user.role === "duty" && (
        <div className="card card-wide request-form-card">
          <h2>Новая заявка</h2>
          <form className="request-form" onSubmit={submitCreate}>
            <div className="request-form-grid">
              <label>
                Тип заявки
                <select
                  required
                  value={createForm.type}
                  onChange={(event) => setCreateForm({ ...createForm, type: event.target.value as CreateForm["type"] })}
                >
                  <option value="inspection">Осмотр</option>
                  <option value="repair">Ремонт</option>
                </select>
              </label>

              <label>
                Оборудование
                <select
                  required
                  value={createForm.equipmentId}
                  onChange={(event) => setCreateForm({ ...createForm, equipmentId: event.target.value })}
                  disabled={equipmentLoading || equipment.length === 0}
                >
                  <option value="">Выбери оборудование</option>
                  {equipment.map((item) => (
                    <option key={item.equipmentId} value={item.equipmentId}>
                      {item.equipmentName} ({item.equipmentId})
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Приоритет
                <select
                  required
                  value={createForm.priority}
                  onChange={(event) => setCreateForm({ ...createForm, priority: event.target.value as CreateForm["priority"] })}
                >
                  <option value="low">Низкий</option>
                  <option value="normal">Обычный</option>
                  <option value="high">Высокий</option>
                </select>
              </label>

              <label>
                Срок выполнения
                <input
                  type="datetime-local"
                  required
                  value={createForm.dueAt}
                  onChange={(event) => setCreateForm({ ...createForm, dueAt: event.target.value })}
                />
              </label>

              <label>
                Имя автора
                <input
                  required
                  value={createForm.authorName}
                  onChange={(event) => setCreateForm({ ...createForm, authorName: event.target.value })}
                  maxLength={150}
                />
              </label>

              <label>
                Контакт автора
                <input
                  required
                  value={createForm.authorContact}
                  onChange={(event) => setCreateForm({ ...createForm, authorContact: event.target.value })}
                  placeholder="Телефон или почта"
                  maxLength={200}
                />
              </label>

              <label className="request-form-full">
                Описание проблемы
                <textarea
                  required
                  value={createForm.description}
                  onChange={(event) => setCreateForm({ ...createForm, description: event.target.value })}
                  placeholder="Опиши неисправность или необходимый осмотр"
                  maxLength={10000}
                />
              </label>
            </div>

            {equipmentLoading && <p className="muted">Загружаем список оборудования...</p>}
            {!equipmentLoading && equipment.length === 0 && !createError && (
              <p className="muted">В базе не найдено оборудование, поэтому создать заявку пока нельзя.</p>
            )}
            {createError && <p className="error">{createError}</p>}

            <div className="request-form-actions">
              <button type="submit" disabled={createBusy || equipmentLoading || equipment.length === 0}>
                {createBusy ? "создаём..." : "создать заявку"}
              </button>
              <button className="button-secondary" type="button" onClick={() => setCreateOpen(false)}>
                отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {!error && rows.length === 0 && <p className="muted">пусто</p>}

      {rows.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>описание</th>
              <th>тип</th>
              <th>статус</th>
              <th>приоритет</th>
              <th>исполнитель</th>
              <th>срок</th>
              <th>действие</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className={r.overdue ? "row-overdue" : ""}
                onClick={() => onOpen(r.id)}
              >
                <td>{r.description}</td>
                <td>{r.type == "repair" ? "ремонт" : "осмотр"}</td>
                <td>
                  <span className={"badge badge-" + r.status}>{STATUSES[r.status]}</span>
                  {r.overdue && <span className="badge badge-overdue"> просрочка!</span>}
                </td>
                <td>{r.priority}</td>
                <td>{r.assignee || "—"}</td>
                <td>{new Date(r.dueAt).toLocaleDateString("ru-RU")}</td>
                <td>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen(r.id);
                    }}
                  >
                    открыть
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RequestsPage;
