
import { NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <NavLink to="/" className="logo">
          🌬️ Ветропарк
        </NavLink>

        <nav className="navigation" aria-label="Основное меню">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Главная
          </NavLink>

          <NavLink
            to="/requests"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Заявки
          </NavLink>

          <NavLink
            to="/equipment"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Оборудование
          </NavLink>

          <NavLink
            to="/requests/new"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            + Создать заявку
          </NavLink>
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
