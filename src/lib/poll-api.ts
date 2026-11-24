import { supabase } from "@/integrations/supabase/client";
import { buildTally, type Tally } from "./poll";

const VOTER_KEY = "poll:voter";
const VOTED_KEY = "poll:voted";

/** Stable anonymous id for this browser, so each device votes once. */
export function voterId(): string {
  let id = localStorage.getItem(VOTER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VOTER_KEY, id);
  }
  return id;
}

export const hasVoted = () => localStorage.getItem(VOTED_KEY) === "1";

export async function fetchTally(): Promise<Tally> {
  const { data, error } = await supabase.rpc("get_poll_results");
  if (error) throw error;
  return buildTally((data ?? []).map((r) => ({ question: r.question, option: r.option, votes: Number(r.votes) })));
}

/** Saves the ballot; returns "already" when this device has voted before. */
export async function submitVote(answers: number[]): Promise<"ok" | "already"> {
  const [q1, q2, q3, q4, q5] = answers;
  if ([q1, q2, q3, q4, q5].some((a) => a === undefined || a < 0 || a > 3)) throw new Error("Incomplete ballot");
  const { error } = await supabase
    .from("poll_votes")
    .insert({ voter_id: voterId(), q1: q1!, q2: q2!, q3: q3!, q4: q4!, q5: q5! });
  if (error && error.code !== "23505") throw error;
  localStorage.setItem(VOTED_KEY, "1");
  return error ? "already" : "ok";
}
