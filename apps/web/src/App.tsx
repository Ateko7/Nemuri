import { useEffect, useState } from "react";
import { RootLayout } from "./components/RootLayout";
import { goTo, useRoute } from "./router";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { InterviewPage } from "./pages/InterviewPage";
import { DashboardPage, type AssistantState } from "./pages/DashboardPage";
import { TimelinePage, type TimelineEntry } from "./pages/TimelinePage";
import { PlanPage } from "./pages/PlanPage";
import { LibraryPage } from "./pages/LibraryPage";
import { ChatPage } from "./pages/ChatPage";
import {
  createSleepEvent,
  fetchClientProfile,
  fetchSleepEvents,
  getCurrentSession,
  getSessionUser,
  saveInterviewAnswers,
  signInClient,
  signOutClient,
  signUpClient,
  type ClientProfileRecord
} from "./lib/clientData";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

export function App() {
  const route = useRoute();
  const [recentEvents, setRecentEvents] = useState<TimelineEntry[]>([]);
  const [quickLog, setQuickLog] = useState("Sin registros nuevos");
  const [authReady, setAuthReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ClientProfileRecord | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [savingAction, setSavingAction] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthReady(true);
      return;
    }

    let ignore = false;

    const bootstrap = async () => {
      try {
        const session = await getCurrentSession();
        const currentUser = getSessionUser(session);

        if (ignore) return;

        if (currentUser) {
          setUserId(currentUser.id);
          const [profileData, eventData] = await Promise.all([
            fetchClientProfile(currentUser.id),
            fetchSleepEvents(currentUser.id)
          ]);

          if (ignore) return;

          setProfile(profileData ?? null);
          setRecentEvents(
            eventData.map((item) => ({
              label: item.label,
              time: nowLabelFromIso(item.event_time)
            }))
          );
        }
      } catch (error) {
        if (!ignore) {
          setAuthError(getErrorMessage(error));
        }
      } finally {
        if (!ignore) {
          setAuthReady(true);
        }
      }
    };

    void bootstrap();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = getSessionUser(session);
      setUserId(currentUser?.id ?? null);
      if (!currentUser) {
        setProfile(null);
        setRecentEvents([]);
      }
    });

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authReady) return;

    const isProtected = ["/dashboard", "/timeline", "/plan", "/biblioteca", "/chat", "/interview"].includes(route);

    if (!userId) {
      if (isProtected) {
        goTo("/login", true);
      }
      return;
    }

    if (route === "/login" || route === "/signup") {
      goTo(profile?.onboarding_completed ? "/dashboard" : "/interview", true);
    }

    if (route === "/interview" && profile?.onboarding_completed) {
      goTo("/dashboard", true);
    }
  }, [authReady, profile?.onboarding_completed, route, userId]);

  const registerQuickAction = async (action: string) => {
    if (!userId) return;

    if (action === "Inicio siesta" && hasOpenNap(recentEvents)) {
      setQuickLog("Ya hay una siesta iniciada. Marca Fin siesta antes de iniciar otra.");
      return;
    }

    if (action === "Fin siesta" && !hasOpenNap(recentEvents)) {
      setQuickLog("Primero registra Inicio siesta antes de marcar Fin siesta.");
      return;
    }

    if (action === "Dormir noche" && hasOpenNightSleep(recentEvents)) {
      setQuickLog("Ya hay un sueno nocturno activo. Usa Terminar sueno para cerrarlo.");
      return;
    }

    if (action === "Despertar noche" && !hasOpenNightSleep(recentEvents)) {
      setQuickLog("Primero registra Dormir noche antes de agregar despertares.");
      return;
    }

    if (action === "Terminar sueno" && !hasOpenNightSleep(recentEvents)) {
      setQuickLog("Primero registra Dormir noche antes de terminar el sueno.");
      return;
    }

    setSavingAction(true);
    setAuthError(null);
    try {
      const event = await createSleepEvent({
        userId,
        eventType: normalizeEventType(action),
        label: action
      });

      const entry = { label: event.label, time: nowLabelFromIso(event.event_time) };
      setRecentEvents((current) => [entry, ...current].slice(0, 10));
      setQuickLog(`Ultimo registro: ${action} a las ${entry.time}`);
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setSavingAction(false);
    }
  };

  const handleLogin = async (values: { email: string; password: string }) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const data = await signInClient(values.email, values.password);
      const currentUser = data.user;
      const profileData = await fetchClientProfile(currentUser.id);
      const eventData = await fetchSleepEvents(currentUser.id);
      setUserId(currentUser.id);
      setProfile(profileData ?? null);
      setRecentEvents(
        eventData.map((item) => ({
          label: item.label,
          time: nowLabelFromIso(item.event_time)
        }))
      );
      goTo(profileData?.onboarding_completed ? "/dashboard" : "/interview");
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (values: {
    parentName: string;
    email: string;
    password: string;
    babyName: string;
  }) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const data = await signUpClient(values);

      if (!data.session || !data.user) {
        setAuthError("Activa email confirmation deshabilitado en Supabase o confirma el correo antes de ingresar.");
        goTo("/login");
        return;
      }

      setUserId(data.user.id);
      const profileData = await fetchClientProfile(data.user.id);
      setProfile(profileData ?? null);
      goTo("/interview");
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleInterviewComplete = async (
    answers: Array<{ questionKey: string; questionTitle: string; answer: string; stepIndex: number }>
  ) => {
    if (!userId) return;

    setAuthLoading(true);
    setAuthError(null);
    try {
      await saveInterviewAnswers({ userId, answers });
      const profileData = await fetchClientProfile(userId);
      setProfile(profileData ?? null);
      goTo("/dashboard");
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutClient();
      setUserId(null);
      setProfile(null);
      setRecentEvents([]);
      goTo("/login");
    } catch (error) {
      setAuthError(getErrorMessage(error));
    }
  };

  return (
    <RootLayout>
      {!isSupabaseConfigured ? (
        <section className="single-page">
          <article className="panel">
            <span className="eyebrow">Config requerida</span>
            <h2>Supabase no esta configurado</h2>
            <p>Agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `apps/web/.env` para activar auth y persistencia.</p>
          </article>
        </section>
      ) : !authReady ? (
        <section className="single-page">
          <article className="panel">
            <h2>Cargando...</h2>
          </article>
        </section>
      ) : (
        <>
          {route === "/login" && (
            <LoginPage onSubmit={handleLogin} loading={authLoading} errorMessage={authError} />
          )}
          {route === "/signup" && (
            <SignupPage onSubmit={handleSignup} loading={authLoading} errorMessage={authError} />
          )}
          {route === "/interview" && (
            <InterviewPage onComplete={handleInterviewComplete} loading={authLoading} errorMessage={authError} />
          )}
          {route === "/dashboard" && (
            <DashboardPage
              quickLog={quickLog}
              assistantState={getAssistantState(recentEvents)}
              onQuickAction={registerQuickAction}
              saving={savingAction}
              onSignOut={handleSignOut}
            />
          )}
          {route === "/timeline" && <TimelinePage recentEvents={recentEvents} onSignOut={handleSignOut} />}
          {route === "/plan" && <PlanPage onSignOut={handleSignOut} />}
          {route === "/biblioteca" && <LibraryPage onSignOut={handleSignOut} />}
          {route === "/chat" && <ChatPage onSignOut={handleSignOut} />}
        </>
      )}
    </RootLayout>
  );
}

function normalizeEventType(action: string) {
  return action.toLowerCase().replace(/ /g, "_");
}

function hasOpenNap(events: TimelineEntry[]) {
  const latestNapEvent = events.find((event) => event.label === "Inicio siesta" || event.label === "Fin siesta");
  return latestNapEvent?.label === "Inicio siesta";
}

function hasOpenNightSleep(events: TimelineEntry[]) {
  const latestNightEvent = events.find((event) => event.label === "Dormir noche" || event.label === "Terminar sueno");
  return latestNightEvent?.label === "Dormir noche";
}

function getAssistantState(events: TimelineEntry[]): AssistantState {
  const hour = new Date().getHours();
  const isNightWindow = hour >= 18 || hour < 6;
  const wakeupsTonight = countEventsSinceLastNightStart(events, "Despertar noche");

  if (hasOpenNap(events)) {
    return {
      status: "good",
      statusLabel: "Vas bien",
      headline: "Siesta en curso",
      message: "No tienes que decidir nada ahora. Solo registra cuando despierte.",
      reason: "Ya hay una siesta iniciada.",
      primaryAction: "Fin siesta"
    };
  }

  if (hasOpenNightSleep(events)) {
    return {
      status: wakeupsTonight > 3 ? "sensitive" : "good",
      statusLabel: wakeupsTonight > 3 ? "Dia sensible" : "Vas bien",
      headline: "Sueno nocturno activo",
      message: "Manten el ambiente tranquilo. Registra despertares si ocurren.",
      reason: wakeupsTonight > 3 ? "Ya hubo varios despertares esta noche." : "La noche ya esta en seguimiento.",
      primaryAction: "Terminar sueno",
      secondaryAction: "Despertar noche"
    };
  }

  if (isNightWindow) {
    return {
      status: "sensitive",
      statusLabel: "Dia sensible",
      headline: "Hora ideal para dormir",
      message: "Baja estimulos y empieza la rutina de noche.",
      reason: "Estas dentro de la ventana nocturna.",
      primaryAction: "Dormir noche"
    };
  }

  const lastNapWasShort = wasLastNapShort(events);

  return {
    status: lastNapWasShort ? "sensitive" : "good",
    statusLabel: lastNapWasShort ? "Dia sensible" : "Vas bien",
    headline: lastNapWasShort ? "Adelanta la siguiente siesta" : "Proxima siesta en 32 min",
    message: lastNapWasShort ? "La siesta anterior fue corta. Actua un poco antes." : "Empieza a preparar el ambiente con calma.",
    reason: lastNapWasShort ? "Siesta menor a 40 min detectada." : "La rutina va estable por ahora.",
    primaryAction: "Inicio siesta"
  };
}

function countEventsSinceLastNightStart(events: TimelineEntry[], label: string) {
  let count = 0;

  for (const event of events) {
    if (event.label === "Terminar sueno" || event.label === "Dormir noche") break;
    if (event.label === label) count += 1;
  }

  return count;
}

function wasLastNapShort(events: TimelineEntry[]) {
  const lastNapEndIndex = events.findIndex((event) => event.label === "Fin siesta");
  if (lastNapEndIndex === -1) return false;

  const lastNapStart = events.slice(lastNapEndIndex + 1).find((event) => event.label === "Inicio siesta");
  return Boolean(lastNapStart);
}

function nowLabelFromIso(isoDate: string) {
  return new Date(isoDate).toLocaleTimeString("es-GT", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Ocurrio un error inesperado.";
}
