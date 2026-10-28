import { useState } from "react";
import { login } from "../api";

function LoginPage({ onDone }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("заполни оба поля");
      return;
    }

    setError("");
    try {
      const user = await login(email, password);
      onDone(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h1>Вход</h1>
      <form onSubmit={handleSubmit}>
        <label>
          почта
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </label>
        <label>
          пароль
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button disabled={busy}>{busy ? "Загрузка" : "войти"}</button>
      </form>
    </div>
  );
}

export default LoginPage;
