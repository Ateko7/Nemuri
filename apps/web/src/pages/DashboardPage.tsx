import { AppShell } from "../components/AppShell";
import { IconMark, SleepBadge, SleepIllustration, WellnessCard } from "../components/ui";

export interface AssistantState {
  status: "good" | "sensitive" | "high";
  statusLabel: string;
  headline: string;
  message: string;
  reason: string;
  primaryAction: string;
  secondaryAction?: string;
}

export function DashboardPage({
  quickLog,
  assistantState,
  onQuickAction,
  saving,
  onSignOut
}: {
  quickLog: string;
  assistantState: AssistantState;
  onQuickAction: (action: string) => Promise<void>;
  saving: boolean;
  onSignOut: () => void;
}) {
  return (
    <AppShell currentPath="/dashboard" eyebrow="Hoy" title="Tu asistente para este momento" onSignOut={onSignOut}>
      <div className="assistant-dashboard">
        <WellnessCard className={`assistant-hero status-${assistantState.status}`}>
          <div className="assistant-hero-copy">
            <div className="assistant-status-row">
              <span className={`status-pill status-${assistantState.status}`}>{assistantState.statusLabel}</span>
              <SleepBadge icon="spark">Siguiente accion</SleepBadge>
            </div>

            <h2>{assistantState.headline}</h2>
            <p>{assistantState.message}</p>

            <button
              className="assistant-cta"
              disabled={saving}
              onClick={() => void onQuickAction(assistantState.primaryAction)}
            >
              {saving ? "Guardando..." : assistantState.primaryAction}
            </button>

            {assistantState.secondaryAction ? (
              <button
                className="assistant-secondary"
                disabled={saving}
                onClick={() => void onQuickAction(assistantState.secondaryAction ?? "")}
              >
                Registrar despertar sin cerrar la noche
              </button>
            ) : null}
          </div>

          <SleepIllustration />
        </WellnessCard>

        <div className="assistant-grid">
          <WellnessCard className="assistant-card">
            <div className="assistant-card-icon">
              <IconMark name="moon" />
            </div>
            <span className="eyebrow">Plan vivo</span>
            <h3>Prioridad de hoy</h3>
            <p>{assistantState.reason}</p>
          </WellnessCard>

          <WellnessCard className="assistant-card">
            <div className="assistant-card-icon">
              <IconMark name="crib" />
            </div>
            <span className="eyebrow">Ultimo registro</span>
            <h3>{quickLog}</h3>
            <p>Solo registra lo que acaba de pasar. El sistema ajusta el siguiente paso.</p>
          </WellnessCard>
        </div>
      </div>
    </AppShell>
  );
}
