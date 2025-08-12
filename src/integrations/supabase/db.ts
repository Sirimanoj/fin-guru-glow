
import { supabase } from "@/integrations/supabase/client";

// Helper to get the current user's id (required for RLS)
async function getUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Not authenticated");
  return data.user.id;
}

// -------- Types (lightweight, not relying on generated types) --------
export type UUID = string;

export interface UserProfile {
  id?: UUID; // will be set to auth user id
  email: string;
  display_name?: string | null;
  avatar_style?: string | null;
  avatar_url?: string | null;
}

export interface ChatMessageInput {
  avatar_id: string;
  user_message: string;
  ai_response?: string | null;
}

export interface ExpenseInput {
  amount: number;
  category: string;
  note?: string | null;
  date?: string; // YYYY-MM-DD
}

export interface GoalInput {
  title: string;
  target_amount: number;
  current_amount?: number;
  deadline?: string | null; // YYYY-MM-DD
}

export interface FinScoreInput {
  score: number; // 0-100
  badges?: any[]; // jsonb array
}

export interface SettingsInput {
  theme?: string | null;
  notifications?: boolean;
  preferred_avatar?: string | null;
  currency?: string | null;
  monthly_budget_goal?: number | null;
}

// New types for Monthly Budgets
export interface MonthlyExpenseItem {
  label: string;
  amount: number;
}

export interface MonthlyBudgetInput {
  month: string; // 'YYYY-MM'
  income: number;
  savings_goal: number;
  fixed_expenses: MonthlyExpenseItem[];
  variable_expenses: MonthlyExpenseItem[];
}

export interface MonthlyBudgetRow extends MonthlyBudgetInput {
  id: UUID;
  user_id: UUID;
  created_at: string;
  updated_at: string;
}

// -------- Users (profiles) --------
export async function upsertUserProfile(profile: UserProfile) {
  const userId = await getUserId();
  const payload = {
    id: userId,
    email: profile.email,
    display_name: profile.display_name ?? null,
    avatar_style: profile.avatar_style ?? null,
    avatar_url: profile.avatar_url ?? null,
  };
  const { data, error } = await supabase
    .from("users")
    .upsert(payload, { onConflict: "id" })
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getMyProfile() {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// -------- Avatar Library --------
export async function listAvatars() {
  const { data, error } = await supabase.from("avatar_library").select("*").order("name");
  if (error) throw error;
  return data;
}

// -------- Chat History --------
export async function listChatHistory(options?: { avatarId?: string; limit?: number }) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return [];
  const userId = auth.user.id;
  let query = supabase
    .from("chat_history")
    .select("*")
    .eq("user_id", userId)
    .order("timestamp", { ascending: false });
  if (options?.avatarId) query = query.eq("avatar_id", options.avatarId);
  if (options?.limit) query = query.limit(options.limit);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function addChatMessage(input: ChatMessageInput) {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("chat_history")
    .insert({
      user_id: userId,
      avatar_id: input.avatar_id,
      user_message: input.user_message,
      ai_response: input.ai_response ?? null,
    })
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function deleteChatMessage(id: UUID) {
  const userId = await getUserId();
  const { error } = await supabase.from("chat_history").delete().eq("id", id).eq("user_id", userId);
  if (error) throw error;
  return true;
}

// -------- Expenses --------
export async function listExpenses() {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addExpense(expense: ExpenseInput) {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("expenses")
    .insert({
      user_id: userId,
      amount: expense.amount,
      category: expense.category,
      note: expense.note ?? null,
      date: expense.date ?? undefined,
    })
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateExpense(id: UUID, updates: Partial<ExpenseInput>) {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("expenses")
    .update({ ...updates })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function deleteExpense(id: UUID) {
  const userId = await getUserId();
  const { error } = await supabase.from("expenses").delete().eq("id", id).eq("user_id", userId);
  if (error) throw error;
  return true;
}

// -------- Savings Goals --------
export async function listGoals() {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("savings_goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addGoal(goal: GoalInput) {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("savings_goals")
    .insert({
      user_id: userId,
      title: goal.title,
      target_amount: goal.target_amount,
      current_amount: goal.current_amount ?? 0,
      deadline: goal.deadline ?? null,
    })
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateGoal(id: UUID, updates: Partial<GoalInput>) {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("savings_goals")
    .update({ ...updates })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function deleteGoal(id: UUID) {
  const userId = await getUserId();
  const { error } = await supabase.from("savings_goals").delete().eq("id", id).eq("user_id", userId);
  if (error) throw error;
  return true;
}

// -------- Fin Score --------
export async function getFinScore() {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("fin_score")
    .select("*")
    .eq("user_id", userId)
    .order("last_updated", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertFinScore(input: FinScoreInput) {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("fin_score")
    .upsert({
      user_id: userId,
      score: input.score,
      badges: (input.badges ?? []) as any,
    })
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

// -------- Settings --------
export async function getSettings() {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertSettings(input: SettingsInput) {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("settings")
    .upsert({
      user_id: userId,
      theme: input.theme ?? null,
      notifications: input.notifications ?? true,
      preferred_avatar: input.preferred_avatar ?? null,
      currency: input.currency ?? undefined,
      monthly_budget_goal: input.monthly_budget_goal ?? undefined,
    })
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

// -------- Monthly Budgets --------
// NOTE: The generated Supabase types currently don't include "monthly_budgets".
// To avoid type errors, we cast the client to any for these specific calls.
export async function getMonthlyBudget(month: string) {
  const userId = await getUserId();
  const client = supabase as any;
  const { data, error } = await client
    .from("monthly_budgets")
    .select("*")
    .eq("user_id", userId)
    .eq("month", month)
    .maybeSingle();
  if (error) throw error;
  return (data as MonthlyBudgetRow) ?? null;
}

export async function upsertMonthlyBudget(input: MonthlyBudgetInput) {
  const userId = await getUserId();
  const client = supabase as any;
  const { data, error } = await client
    .from("monthly_budgets")
    .upsert(
      {
        user_id: userId,
        month: input.month,
        income: input.income,
        savings_goal: input.savings_goal,
        fixed_expenses: (input.fixed_expenses ?? []) as any,
        variable_expenses: (input.variable_expenses ?? []) as any,
      },
      { onConflict: "user_id,month" }
    )
    .select()
    .maybeSingle();
  if (error) throw error;
  return data as MonthlyBudgetRow;
}

