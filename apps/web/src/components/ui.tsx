import type { CSSProperties, ReactNode } from "react";

type IconName = "moon" | "crib" | "bottle" | "spark";

export function WellnessCard({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return <article className={`wellness-card ${className}`}>{children}</article>;
}

export function SoftButton({
  children,
  variant = "primary",
  className = "",
  disabled,
  onClick,
  type = "button"
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button type={type} className={`soft-action ${variant} ${className}`} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export function StatBlock({
  icon,
  label,
  value,
  tone = "lavender"
}: {
  icon: IconName;
  label: string;
  value: string;
  tone?: "lavender" | "sky" | "rose" | "mint";
}) {
  return (
    <div className={`stat-block ${tone}`}>
      <IconMark name={icon} />
      <div>
        <strong>{label}</strong>
        <small>{value}</small>
      </div>
    </div>
  );
}

export function ProgressRing({ value, label }: { value: number; label: string }) {
  const normalized = Math.max(0, Math.min(100, value));

  return (
    <div className="progress-ring" style={{ "--progress": `${normalized}%` } as CSSProperties}>
      <div className="progress-ring-inner">
        <strong>{normalized}%</strong>
        <small>{label}</small>
      </div>
    </div>
  );
}

export function IconMark({ name }: { name: IconName }) {
  return <span className={`icon-mark icon-${name}`} aria-hidden="true" />;
}

export function SleepBadge({ icon, children }: { icon: IconName; children: ReactNode }) {
  return (
    <span className="sleep-badge">
      <IconMark name={icon} />
      {children}
    </span>
  );
}

export function SleepIllustration() {
  return (
    <div className="sleep-illustration" aria-hidden="true">
      <div className="illustration-orbit">
        <IconMark name="moon" />
      </div>
      <div className="illustration-cloud cloud-a" />
      <div className="illustration-cloud cloud-b" />
    </div>
  );
}
