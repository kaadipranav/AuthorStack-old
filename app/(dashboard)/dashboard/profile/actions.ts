"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { services } from "@/lib/services";
import { requireAuth } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const profileSchema = z.object({
    full_name: z.string().min(2),
    avatar_url: z.string().url().optional().or(z.literal("")),
    subscription_tier: z.enum(["free", "pro", "enterprise"]),
});

export async function updateProfileAction(formData: FormData) {
    const user = await requireAuth();

    const payload = profileSchema.safeParse({
        full_name: formData.get("full_name"),
        avatar_url: formData.get("avatar_url"),
        subscription_tier: formData.get("subscription_tier"),
    });

    if (!payload.success) {
        return {
            success: false,
            message: payload.error.issues[0]?.message ?? "Invalid profile data.",
        };
    }

    try {
        // Update subscription tier via UserService
        await services.user.updateProfile(user.id, {
            subscriptionTier: payload.data.subscription_tier,
        });

        // Update full_name and avatar_url in auth.users metadata
        const supabase = await createSupabaseServerClient();
        await supabase.auth.updateUser({
            data: {
                full_name: payload.data.full_name,
                avatar_url: payload.data.avatar_url || null,
            },
        });
    } catch (error: any) {
        return { success: false, message: error.message };
    }

    revalidatePath("/dashboard/profile");
    return { success: true, message: "Profile updated." };
}
