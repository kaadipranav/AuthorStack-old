"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  passwordResetSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/auth/validators";

export type ActionResponse = {
  success: boolean;
  message: string;
};

export async function signInAction(
  formData: FormData
): Promise<ActionResponse | void> {
  const supabase = await createSupabaseServerClient();
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { email, password } = parsed.data;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function signUpAction(
  formData: FormData
): Promise<ActionResponse | void> {
  const supabase = await createSupabaseServerClient();
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { email, password, fullName } = parsed.data;
  const plan = formData.get("plan") as "free" | "pro" | null;
  const subscriptionTier = plan === "pro" ? "pro" : "free";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${env.NEXTAUTH_URL}/auth/sign-in`,
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  if (data.user?.id) {
    await supabase
      .from("profiles")
      .update({ 
        full_name: fullName,
        subscription_tier: subscriptionTier,
      })
      .eq("id", data.user.id);

    // If PRO plan selected, store intent for post-verification checkout
    if (plan === "pro") {
      await supabase
        .from("profiles")
        .update({ 
          metadata: { pending_pro_checkout: true }
        })
        .eq("id", data.user.id);
    }
  }

  redirect("/auth/verify-email");
}

export async function requestPasswordResetAction(
  formData: FormData
): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();
  const parsed = passwordResetSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid email." };
  }

  const redirectTo = `${env.NEXTAUTH_URL}/auth/sign-in`;
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message: "If this email exists, a reset link will be sent.",
  };
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/auth/sign-in");
}

