
import { NavLink, Outlet } from 'react-router-dom';

const menuItems = [
  { path: '/', label: 'Главная', icon: '▦', end: true },
  { path: '/requests', label: 'Заявки', icon: '☷' },
  { path: '/equipment', label: 'Оборудование', icon: '⚙' },
];

export function Layout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/" className="sidebar-brand">
          <div className="brand-icon">W</div>
          <div>
            <strong>WindControl</strong>
            <small>Управление ветропарком</small>
          </div>
        </NavLink>

        <div className="sidebar-section-title">
          РАБОЧЕЕ ПРОСТРАНСТВО
        </div>

        <nav className="sidebar-nav" aria-label="Основное меню">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'is-active' : ''}`
              }
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <NavLink to="/requests/new" className="sidebar-create">
          <span>＋</span>
          Создать заявку
        </NavLink>

        <div className="sidebar-bottom">
          <div className="sidebar-system">
            <span className="system-dot" />
            Система мониторинга
          </div>
          <small>WindControl · Hackathon</small>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="topbar-heading">
            <span className="topbar-eyebrow">
              Система управления
            </span>
            <strong>Мониторинг ветропарка</strong>
          </div>

          <div className="topbar-right">
            <span className="topbar-label">Рабочая панель</span>
            <div className="user-avatar">W</div>
          </div>
        </header>

        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
