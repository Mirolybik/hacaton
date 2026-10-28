import { useEffect, useState } from "react";
import { getRequests } from "../api";
import { STATUSES } from "../consts";
import RequestDetailPage from "./RequestDetailPage";

function RequestsPage({ user, openId, onOpen, onBye }) {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

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
      </div>

      {error && <p className="error">{error}</p>}
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RequestsPage;
