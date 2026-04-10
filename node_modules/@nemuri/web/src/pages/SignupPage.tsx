import { WellnessCard } from "../components/ui";
import { goTo } from "../router";

export function SignupPage({
  onSubmit,
  loading,
  errorMessage
}: {
  onSubmit: (values: { parentName: string; email: string; password: string; babyName: string }) => Promise<void>;
  loading: boolean;
  errorMessage: string | null;
}) {
  return (
    <section className="single-page">
      <WellnessCard className="signup-panel">
        <form
          className="signup-form"
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            await onSubmit({
              parentName: String(formData.get("parentName") ?? ""),
              email: String(formData.get("email") ?? ""),
              password: String(formData.get("password") ?? ""),
              babyName: String(formData.get("babyName") ?? "")
            });
          }}
        >
          <span className="eyebrow">Signup page</span>
          <h2>Este paso es solo para nuevas familias</h2>

          <div className="form-stack signup-stack">
            <label className="field">
              <span>Tu nombre</span>
              <input name="parentName" defaultValue="Maria Gomez" />
            </label>
            <label className="field">
              <span>Email</span>
              <input name="email" defaultValue="maria@nemuri.com" />
            </label>
            <label className="field">
              <span>Contrasena</span>
              <input name="password" type="password" defaultValue="12345678" />
            </label>
            <label className="field">
              <span>Nombre del bebe</span>
              <input name="babyName" defaultValue="Sofia" />
            </label>
          </div>

          {errorMessage ? <small className="error-text">{errorMessage}</small> : null}

          <div className="footer-actions">
            <button type="button" className="secondary" onClick={() => goTo("/login")}>
              Ya tengo usuario
            </button>
            <button className="primary" disabled={loading}>
              {loading ? "Creando usuario..." : "Ir a interview"}
            </button>
          </div>
        </form>
      </WellnessCard>
    </section>
  );
}
