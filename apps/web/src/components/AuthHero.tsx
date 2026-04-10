import { IconMark, SleepBadge, SleepIllustration } from "./ui";

export function AuthHero() {
  return (
    <div className="brand-panel">
      <span className="eyebrow">Nemuri</span>
      <h1>Un sistema claro para acompanar el sueno y la rutina de tu bebe</h1>
      <p>
        La entrada al producto debe ser simple: si ya tienes cuenta, ingresas. Si eres nueva, creas usuario,
        respondes la entrevista y entras a tu dashboard.
      </p>

      <div className="value-stack">
        <InfoRow title="Login page" text="Entrada para usuarios existentes." />
        <InfoRow title="Signup page" text="Alta de nuevas familias." />
        <InfoRow title="Dashboard page" text="Centro principal de la app." />
      </div>

      <div className="hero-visual">
        <div className="hero-emblem">
          <IconMark name="moon" />
          <strong>nemuri</strong>
          <small>sleep companion</small>
        </div>
        <div className="hero-visual-card">
          <SleepIllustration />
          <div className="hero-chip-stack">
            <SleepBadge icon="moon">Sueno</SleepBadge>
            <SleepBadge icon="crib">Cuna</SleepBadge>
            <SleepBadge icon="bottle">Rutina</SleepBadge>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ title, text }: { title: string; text: string }) {
  return (
    <div className="info-row">
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}
