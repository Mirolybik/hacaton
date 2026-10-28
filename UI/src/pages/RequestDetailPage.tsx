import { useEffect, useState } from "react";
import { getRequest, patchRequest, takeRequest } from "../api";
import { NEXT, PRIOS, STATUSES } from "../consts";

function RequestDetailPage({ id, user, onBack }) {
  const [req, setReq] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // поля блока инженера
  const [next, setNext] = useState("");
  const [comment, setComment] = useState("");
  const [diagnostics, setDiagnostics] = useState("");
  const [workDescription, setWorkDescription] = useState("");

  const reload = async () => {
    try {
      const data = await getRequest(id);
      setReq(data);
      setDiagnostics(data.diagnostics || "");
      setWorkDescription(data.workDescription || "");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    reload();
  }, [id]);

  const run = async (fn) => {
    setBusy(true);
    setError("");
    try {
      await fn();
      await reload();
    } catch (err) {
      
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!req && !error) {
    return <p className="muted">грузим...</p>;
  }
  if (!req) {
    return <p className="error">{error}</p>;
  }

  const alive = req.status != "done";
  const canEngineer = user.role == "engineer" && alive;
  const canDirector = user.role == "director" && alive;

  const saveStatus = () => {
    const body: any = { status: next };
    if (next == "waiting_parts") body.waitingComment = comment;
    if (next == "done") body.closingComment = comment;
    if (diagnostics) body.diagnostics = diagnostics;
    if (workDescription) body.workDescription = workDescription;

    run(async () => {
      await patchRequest(id, body);
      setNext("");
      setComment("");
    });
  };

  const commentNeeded = next != "" && next != "in_progress";

  return (
    <div className="page">
      <header className="topbar">
        <button onClick={onBack}>← назад</button>
        <h1>заявка</h1>
        <span className={"badge badge-" + req.status}>{STATUSES[req.status]}</span>
        {req.overdue && <span className="badge badge-overdue">просрочка!</span>}
      </header>

      {error && <p className="error">{error}</p>}

      <div className="card card-wide">
        <dl className="details">
          <dt>описание</dt>
          <dd>{req.description}</dd>
          <dt>тип</dt>
          <dd>{req.type == "repair" ? "ремонт" : "осмотр"}</dd>
          <dt>оборудование</dt>
          <dd>{req.equipmentId || "—"}</dd>
          <dt>приоритет</dt>
          <dd>{PRIOS[req.priority]}</dd>
          <dt>автор</dt>
          <dd>
            {req.authorName} ({req.authorContact})
          </dd>
          <dt>исполнитель</dt>
          <dd>{req.assignee || "не назначен"}</dd>
          <dt>срок</dt>
          <dd>{new Date(req.dueAt).toLocaleString("ru-RU")}</dd>

          {req.diagnostics && (
            <>
              <dt>диагностика</dt>
              <dd>{req.diagnostics}</dd>
            </>
          )}
          {req.workDescription && (
            <>
              <dt>что делали</dt>
              <dd>{req.workDescription}</dd>
            </>
          )}
          {req.waitingComment && (
            <>
              <dt>ждём запчасти</dt>
              <dd>{req.waitingComment}</dd>
            </>
          )}
          {req.closingComment && (
            <>
              <dt>итог</dt>
              <dd>{req.closingComment}</dd>
            </>
          )}
        </dl>
      </div>

      {canEngineer && (
        <div className="card card-wide">
          <h2>инженеру</h2>

          {!req.assignee && (
            <button disabled={busy} onClick={() => run(() => takeRequest(id))}>
              взять в работу
            </button>
          )}

          <div className="row">
            <label>
              перевести в:{" "}
              <select value={next} onChange={(e) => setNext(e.target.value)}>
                <option value="">— выбери —</option>
                {(NEXT[req.status] || []).map((s) => (
                  <option key={s} value={s}>
                    {STATUSES[s]}
                  </option>
                ))}
              </select>
            </label>

            {next && (
              <>
                
                <textarea
                  placeholder={
                    next == "waiting_parts"
                      ? "какие запчасти ждёшь? (без него не сохранит)"
                      : next == "done"
                        ? "что сделал? (обязательно)"
                        : "комментарий, необязательно"
                  }
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <textarea
                  placeholder="диагностика"
                  value={diagnostics}
                  onChange={(e) => setDiagnostics(e.target.value)}
                />
                <textarea
                  placeholder="выполненные работы"
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                />
                <button disabled={busy || (commentNeeded && !comment.trim())} onClick={saveStatus}>
                  {busy ? "сохраняем..." : "применить"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {canDirector && (
        <div className="card card-wide">
          <h2>директору</h2>
          <div className="row">
            <label>
              приоритет:{" "}
              <select
                defaultValue={req.priority}
                onChange={(e) => run(() => patchRequest(id, { priority: e.target.value }))}
              >
                {Object.keys(PRIOS).map((p) => (
                  <option key={p} value={p}>
                    {PRIOS[p]}
                  </option>
                ))}
              </select>
            </label>

            <label>
              исполнитель:{" "}
              <input
                defaultValue={req.assignee || ""}
                placeholder="имя инженера"
                onBlur={(e) => {
                  if (e.target.value != (req.assignee || "")) {
                    run(() => patchRequest(id, { assignee: e.target.value || null }));
                  }
                }}
              />
            </label>
          </div>
        </div>
      )}

      {req.history?.length > 0 && (
        <div className="card card-wide">
          <h2>история</h2>
          <ul className="history">
            {[...req.history].reverse().map((h) => (
              <li key={h.id}>
                <span className="muted">{new Date(h.createdAt).toLocaleString("ru-RU")}</span>{" "}
                <b>{h.userName}</b>: {h.action}
                {h.field && ` (${h.oldValue || "—"} → ${h.newValue || "—"})`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RequestDetailPage;
