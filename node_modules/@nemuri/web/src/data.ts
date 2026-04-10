import type { BabyProfile, Message, Recommendation, SleepEvent } from "./types";

export const defaultProfile: BabyProfile = {
  name: "Sofia",
  ageLabel: "6 meses",
  feedingType: "Lactancia mixta",
  mainProblem: "Despertares nocturnos y siestas cortas",
  wakeUps: 4,
  urgency: "Media",
  sleepType: "Se duerme en brazos"
};

export const sleepTimeline: SleepEvent[] = [
  { id: "1", label: "Despertar del dia", time: "06:45", mood: "tranquila" },
  { id: "2", label: "Siesta 1", time: "09:10 - 09:55", mood: "se durmio con ayuda" },
  { id: "3", label: "Siesta 2", time: "12:35 - 13:18", mood: "despertar corto" },
  { id: "4", label: "Siesta 3", time: "16:05 - 16:32", mood: "resistente" },
  { id: "5", label: "Dormir noche", time: "19:42", mood: "se durmio alimentandose" }
];

export const recommendations: Recommendation[] = [
  {
    title: "Objetivo de esta semana",
    detail: "Consolidar una rutina pre-siesta consistente y reducir sobrecansancio antes de la segunda siesta."
  },
  {
    title: "Proxima siesta sugerida",
    detail: "Entre 2h15 y 2h30 despues del despertar, idealmente 09:00."
  },
  {
    title: "Ajuste dinamico",
    detail: "Si la primera siesta dura menos de 40 minutos, adelantar la siguiente ventana 15 minutos."
  }
];

export const messages: Message[] = [
  { from: "advisor", text: "Hoy vamos a priorizar una primera ventana tranquila y corta.", time: "08:10" },
  { from: "parent", text: "Se desperto 4 veces anoche y esta sensible.", time: "08:14" },
  { from: "advisor", text: "Lo esperable hoy es que necesite mas contencion. Ajuste la segunda siesta 15 minutos antes.", time: "08:16" }
];

export const contentCards = [
  {
    title: "Regresion de los 6 meses",
    meta: "Lectura 4 min",
    blurb: "Que cambia en el sueno y como responder sin sumar mas frustracion."
  },
  {
    title: "Transicion de brazos a cuna",
    meta: "Checklist",
    blurb: "Pasos simples para hacerlo mas predecible y menos tenso."
  },
  {
    title: "Siestas cortas",
    meta: "Audio 6 min",
    blurb: "Como diferenciar siesta inmadura, sobrecansancio o dependencia."
  }
];

export const adminCases = [
  {
    baby: "Sofia",
    family: "Familia Gomez",
    risk: "Medio",
    summary: "4 despertares, siesta 3 corta, buena adherencia"
  },
  {
    baby: "Mateo",
    family: "Familia Ruiz",
    risk: "Alto",
    summary: "6 despertares, resistencia fuerte al dormir, poco registro"
  },
  {
    baby: "Emma",
    family: "Familia Lara",
    risk: "Bajo",
    summary: "Dia estable, plan funcionando, revisar transicion de siesta"
  }
];
