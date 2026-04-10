import { AppShell } from "../components/AppShell";
import { messages } from "../data";

export function ChatPage({ onSignOut }: { onSignOut: () => void }) {
  return (
    <AppShell currentPath="/chat" eyebrow="Chat page" title="Acompanamiento con asesora" onSignOut={onSignOut}>
      <article className="panel wide-panel">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={`${message.time}-${index}`} className={message.from === "advisor" ? "bubble advisor" : "bubble parent"}>
              <p>{message.text}</p>
              <small>{message.time}</small>
            </div>
          ))}
        </div>
        <div className="composer">
          <input placeholder="Escribe una actualizacion rapida..." />
          <button className="primary">Enviar</button>
        </div>
      </article>
    </AppShell>
  );
}
