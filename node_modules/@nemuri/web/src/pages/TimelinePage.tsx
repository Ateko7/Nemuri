import { AppShell } from "../components/AppShell";
import { sleepTimeline } from "../data";

export interface TimelineEntry {
  label: string;
  time: string;
  mood?: string;
}

export function TimelinePage({ recentEvents, onSignOut }: { recentEvents: TimelineEntry[]; onSignOut: () => void }) {
  return (
    <AppShell currentPath="/timeline" eyebrow="Timeline page" title="Registro completo del dia" onSignOut={onSignOut}>
      <article className="panel wide-panel">
        <div className="list-stack">
          {recentEvents.map((event, index) => (
            <div key={`${event.label}-${event.time}-${index}`} className="timeline-item">
              <div className="timeline-dot" />
              <div>
                <strong>{event.label}</strong>
                <p>{event.time}</p>
                {event.mood ? <small>{event.mood}</small> : <small>Registro rapido desde dashboard</small>}
              </div>
            </div>
          ))}

          {sleepTimeline.map((event) => (
            <div key={event.id} className="timeline-item">
              <div className="timeline-dot" />
              <div>
                <strong>{event.label}</strong>
                <p>{event.time}</p>
                <small>{event.mood}</small>
              </div>
            </div>
          ))}
        </div>
      </article>
    </AppShell>
  );
}
