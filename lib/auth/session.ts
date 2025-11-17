import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/sign-in");
  }
  return user;
}

export async function getCurrentProfile() {
  const supabase = await createSupabaseServerClient();
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return data;
}

