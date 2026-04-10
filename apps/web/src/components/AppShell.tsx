import type { ReactNode } from "react";
import { defaultProfile } from "../data";
import { goTo } from "../router";
import type { RoutePath } from "../types";
import { dashboardRoutes } from "../pages/pageData";
import { IconMark, SleepBadge } from "./ui";

export function AppShell({
  currentPath,
  title,
  eyebrow,
  onSignOut,
  children
}: {
  currentPath: RoutePath;
  title: string;
  eyebrow: string;
  onSignOut: () => void;
  children: ReactNode;
}) {
  return (
    <section className="app-shell-layout">
      <aside className="app-sidebar panel">
        <div className="brand-block">
          <div className="sidebar-emblem">
            <IconMark name="moon" />
          </div>
          <span className="eyebrow">Nemuri</span>
          <h3>{defaultProfile.name}</h3>
          <p>{defaultProfile.ageLabel}</p>
        </div>

        <nav className="sidebar-nav">
          {dashboardRoutes.map((item) => (
            <button
              key={item.path}
              className={currentPath === item.path ? "nav-item active" : "nav-item"}
              onClick={() => goTo(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-note">
          <span className="eyebrow">Hoy</span>
          <strong>Pregunta clave</strong>
          <small>Que hago ahora?</small>
          <div className="note-mini-icons">
            <SleepBadge icon="moon">Sueno</SleepBadge>
            <SleepBadge icon="crib">Cuna</SleepBadge>
          </div>
        </div>

        <button className="secondary full" onClick={onSignOut}>
          Cerrar sesion
        </button>
      </aside>

      <div className="app-main">
        <header className="app-header">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>Una vista tranquila para decidir que hacer ahora, sin sobrecargarte.</p>
        </header>
        {children}
      </div>
    </section>
  );
}
