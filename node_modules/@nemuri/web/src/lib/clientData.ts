import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export interface ClientProfileRecord {
  user_id: string;
  parent_name: string | null;
  baby_name: string | null;
  onboarding_completed: boolean;
}

export interface SleepEventRecord {
  id: string;
  user_id: string;
  event_type: string;
  label: string;
  event_time: string;
  source: string;
}

function requireSupabase() {
  if (!supabase) {
    throw new Error("Supabase no esta configurado. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.");
  }

  return supabase;
}

export async function signInClient(email: string, password: string) {
  const client = requireSupabase();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpClient(params: {
  email: string;
  password: string;
  parentName: string;
  babyName: string;
}) {
  const client = requireSupabase();
  const { data, error } = await client.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        parent_name: params.parentName,
        baby_name: params.babyName
      }
    }
  });

  if (error) throw error;

  if (data.user && data.session) {
    await upsertClientProfile({
      user_id: data.user.id,
      parent_name: params.parentName,
      baby_name: params.babyName,
      onboarding_completed: false
    });
  }

  return data;
}

export async function signOutClient() {
  const client = requireSupabase();
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession() {
  const client = requireSupabase();
  const { data, error } = await client.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function upsertClientProfile(profile: ClientProfileRecord) {
  const client = requireSupabase();
  const { error } = await client.from("client_profiles").upsert(profile);
  if (error) throw error;
}

export async function fetchClientProfile(userId: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("client_profiles")
    .select("user_id,parent_name,baby_name,onboarding_completed")
    .eq("user_id", userId)
    .maybeSingle<ClientProfileRecord>();

  if (error) throw error;
  return data;
}

export async function saveInterviewAnswers(params: {
  userId: string;
  answers: Array<{ questionKey: string; questionTitle: string; answer: string; stepIndex: number }>;
}) {
  const client = requireSupabase();

  const payload = params.answers.map((item) => ({
    user_id: params.userId,
    question_key: item.questionKey,
    question_title: item.questionTitle,
    answer: item.answer,
    step_index: item.stepIndex
  }));

  const { error } = await client.from("interview_answers").upsert(payload, {
    onConflict: "user_id,question_key"
  });

  if (error) throw error;

  const { error: profileError } = await client
    .from("client_profiles")
    .update({ onboarding_completed: true })
    .eq("user_id", params.userId);

  if (profileError) throw profileError;
}

export async function createSleepEvent(params: {
  userId: string;
  eventType: string;
  label: string;
}) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("sleep_events")
    .insert({
      user_id: params.userId,
      event_type: params.eventType,
      label: params.label,
      source: "dashboard"
    })
    .select("id,user_id,event_type,label,event_time,source")
    .single<SleepEventRecord>();

  if (error) throw error;
  return data;
}

export async function fetchSleepEvents(userId: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("sleep_events")
    .select("id,user_id,event_type,label,event_time,source")
    .eq("user_id", userId)
    .order("event_time", { ascending: false })
    .limit(20);

  if (error) throw error;
  return (data ?? []) as SleepEventRecord[];
}

export function getSessionUser(session: Session | null) {
  return session?.user ?? null;
}
