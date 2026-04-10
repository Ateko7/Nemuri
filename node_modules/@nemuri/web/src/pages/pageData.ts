import type { InterviewQuestion, RoutePath } from "../types";

export const interviewQuestions: InterviewQuestion[] = [
  {
    title: "Edad del bebe",
    helper: "Esto ajusta ventanas de sueno y expectativas para su etapa.",
    options: ["0 a 3 meses", "4 a 6 meses", "7 a 12 meses", "1 a 3 anos"]
  },
  {
    title: "Problema principal",
    helper: "Vamos a priorizar una sola necesidad para empezar con foco.",
    options: ["Despertares nocturnos", "Siestas cortas", "Dormirse mejor", "Tener rutina"]
  },
  {
    title: "Como suele dormirse",
    helper: "Esto nos ayuda a adaptar el plan sin pedir cambios bruscos.",
    options: ["En brazos", "Al pecho o biberon", "En cuna con ayuda", "Casi solo"]
  },
  {
    title: "Cuantos despertares hay por noche",
    helper: "No buscamos perfeccion, solo un punto de partida realista.",
    options: ["1 a 2", "3 a 4", "5 a 6", "Mas de 6"]
  }
];

export const dashboardRoutes: Array<{ label: string; path: RoutePath }> = [
  { label: "Hoy", path: "/dashboard" },
  { label: "Historia", path: "/timeline" },
  { label: "Ayuda", path: "/plan" }
];

export const quickActions = ["Inicio siesta", "Fin siesta", "Dormir noche", "Despertar noche"];
