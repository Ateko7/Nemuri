import { AppShell } from "../components/AppShell";
import { contentCards } from "../data";

export function LibraryPage({ onSignOut }: { onSignOut: () => void }) {
  return (
    <AppShell currentPath="/biblioteca" eyebrow="Biblioteca page" title="Contenido recomendado" onSignOut={onSignOut}>
      <article className="panel wide-panel">
        <div className="list-stack">
          {contentCards.map((item) => (
            <div key={item.title} className="plain-item">
              <strong>{item.title}</strong>
              <p>{item.blurb}</p>
              <small>{item.meta}</small>
            </div>
          ))}
        </div>
      </article>
    </AppShell>
  );
}
