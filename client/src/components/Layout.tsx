import { Link, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="logo">
          Hacaton
        </Link>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
