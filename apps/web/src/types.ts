export type RoutePath =
  | "/login"
  | "/signup"
  | "/interview"
  | "/dashboard"
  | "/timeline"
  | "/plan"
  | "/biblioteca"
  | "/chat";

export interface InterviewQuestion {
  title: string;
  helper: string;
  options: string[];
}

export interface BabyProfile {
  name: string;
  ageLabel: string;
  feedingType: string;
  mainProblem: string;
  wakeUps: number;
  urgency: "Baja" | "Media" | "Alta";
  sleepType: string;
}

export interface SleepEvent {
  id: string;
  label: string;
  time: string;
  mood: string;
}

export interface Recommendation {
  title: string;
  detail: string;
}

export interface Message {
  from: "parent" | "advisor";
  text: string;
  time: string;
}
