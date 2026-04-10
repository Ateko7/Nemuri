import type { ReactNode } from "react";

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main className="app-background">
      <div className="glow glow-left" />
      <div className="glow glow-right" />
      <div className="ambient-blob blob-one" />
      <div className="ambient-blob blob-two" />
      <div className="page-wrap">{children}</div>
    </main>
  );
}
