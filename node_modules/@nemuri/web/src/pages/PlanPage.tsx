import { AppShell } from "../components/AppShell";
import { WellnessCard } from "../components/ui";
import { goTo } from "../router";
import { contentCards, messages, recommendations } from "../data";

export function PlanPage({ onSignOut }: { onSignOut: () => void }) {
  const latestAdvisorMessage = messages.find((message) => message.from === "advisor");

  return (
    <AppShell currentPath="/plan" eyebrow="Ayuda" title="Plan, contenido y asesora" onSignOut={onSignOut}>
      <div className="help-grid">
        <WellnessCard className="help-primary">
          <span className="eyebrow">Plan vivo</span>
          <h2>{recommendations[0]?.title}</h2>
          <p>{recommendations[0]?.detail}</p>
          <button className="assistant-secondary" onClick={() => goTo("/dashboard")}>
            Volver a la accion de hoy
          </button>
        </WellnessCard>

        <WellnessCard className="assistant-card">
          <span className="eyebrow">Biblioteca</span>
          <h3>{contentCards[0]?.title}</h3>
          <p>{contentCards[0]?.blurb}</p>
          <button className="secondary" onClick={() => goTo("/biblioteca")}>
            Ver contenido
          </button>
        </WellnessCard>

        <WellnessCard className="assistant-card">
          <span className="eyebrow">Chat</span>
          <h3>Asesora</h3>
          <p>{latestAdvisorMessage?.text ?? "Escribe una actualizacion rapida para tu asesora."}</p>
          <button className="secondary" onClick={() => goTo("/chat")}>
            Abrir chat
          </button>
        </WellnessCard>
      </div>
    </AppShell>
  );
}
