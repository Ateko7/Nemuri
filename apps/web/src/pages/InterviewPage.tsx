import { useMemo, useState } from "react";
import { goTo } from "../router";
import { interviewQuestions } from "./pageData";
import { SleepBadge, WellnessCard } from "../components/ui";

export function InterviewPage({
  onComplete,
  loading,
  errorMessage
}: {
  onComplete: (
    answers: Array<{ questionKey: string; questionTitle: string; answer: string; stepIndex: number }>
  ) => Promise<void>;
  loading: boolean;
  errorMessage: string | null;
}) {
  const [step, setStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const question = interviewQuestions[step];
  const progress = useMemo(() => ((step + 1) / interviewQuestions.length) * 100, [step]);
  const isLastStep = step === interviewQuestions.length - 1;

  return (
    <section className="onboarding-layout">
      <WellnessCard className="onboarding-side">
        <span className="eyebrow">Interview page</span>
        <h2>Entrevista inicial</h2>
        <p>Esta pantalla es solo para nuevos usuarios. Al terminar, pasan al dashboard principal.</p>
        <div className="interview-icons">
          <SleepBadge icon="moon">Sueno</SleepBadge>
          <SleepBadge icon="crib">Cuna</SleepBadge>
          <SleepBadge icon="bottle">Rutina</SleepBadge>
        </div>
        <div className="progress-shell">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <small>Paso {step + 1} de {interviewQuestions.length}</small>
      </WellnessCard>

      <WellnessCard className="onboarding-main">
        <span className="eyebrow">Pregunta actual</span>
        <h2>{question.title}</h2>
        <p>{question.helper}</p>

        <div className="answer-list">
          {question.options.map((option: string) => (
            <button
              key={option}
              className={selectedAnswer === option ? "answer-card selected" : "answer-card"}
              onClick={() => setSelectedAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="footer-actions">
          <button type="button" className="secondary" onClick={() => goTo("/signup")}>
            Volver
          </button>
          <button
            className="primary"
            disabled={!selectedAnswer || loading}
            onClick={async () => {
              if (!selectedAnswer) return;

              const nextAnswers = { ...answers, [step]: selectedAnswer };

              if (isLastStep) {
                await onComplete(
                  interviewQuestions.map((item, index) => ({
                    questionKey: `step_${index + 1}`,
                    questionTitle: item.title,
                    answer: nextAnswers[index] ?? "",
                    stepIndex: index + 1
                  }))
                );
                return;
              }

              setAnswers(nextAnswers);
              setStep((current: number) => current + 1);
              setSelectedAnswer(nextAnswers[step + 1] ?? null);
            }}
          >
            {loading ? "Guardando..." : isLastStep ? "Terminar y entrar a la app" : "Siguiente"}
          </button>
        </div>

        {errorMessage ? <small className="error-text">{errorMessage}</small> : null}
      </WellnessCard>
    </section>
  );
}
