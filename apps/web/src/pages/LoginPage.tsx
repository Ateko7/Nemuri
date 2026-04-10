import { AuthHero } from "../components/AuthHero";
import { goTo } from "../router";
import { WellnessCard } from "../components/ui";

export function LoginPage({
  onSubmit,
  loading,
  errorMessage
}: {
  onSubmit: (values: { email: string; password: string }) => Promise<void>;
  loading: boolean;
  errorMessage: string | null;
}) {
  return (
    <section className="auth-layout">
      <AuthHero />

      <WellnessCard className="auth-panel">
        <form
          className="auth-content"
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            await onSubmit({
              email: String(formData.get("email") ?? ""),
              password: String(formData.get("password") ?? "")
            });
          }}
        >
          <div>
            <span className="eyebrow">Login page</span>
            <h2>Bienvenida de vuelta</h2>
            <p>Entra directo a tu dashboard principal.</p>
          </div>

          <div className="form-stack">
            <label className="field">
              <span>Email</span>
              <input name="email" defaultValue="maria@nemuri.com" />
            </label>
            <label className="field">
              <span>Contrasena</span>
              <input name="password" type="password" defaultValue="12345678" />
            </label>
          </div>

          {errorMessage ? <small className="error-text">{errorMessage}</small> : null}

          <div className="footer-actions">
            <button type="button" className="secondary" onClick={() => goTo("/signup")}>
              Crear usuario
            </button>
            <button className="primary" disabled={loading}>
              {loading ? "Entrando..." : "Entrar al dashboard"}
            </button>
          </div>
        </form>
      </WellnessCard>
    </section>
  );
}
