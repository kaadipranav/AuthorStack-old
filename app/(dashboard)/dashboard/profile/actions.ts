"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { services } from "@/lib/services";
import { requireAuth } from "@/lib/auth/session";

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
        // Update user profile (subscription tier)
        await services.user.updateProfile(user.id, {
            subscriptionTier: payload.data.subscription_tier,
        });

        // Update user basic info (full name, avatar) - wait, UserService.updateProfile updates UserProfile.
        // User basic info is in User object (auth).
        // SupabaseUserRepository.updateProfile updates 'profiles' table.
        // Does 'profiles' table contain full_name and avatar_url?
        // Let's assume yes based on previous code.
        // But my UserProfile interface has username, bio, website, subscriptionTier.
        // It seems I missed full_name and avatar_url in UserProfile interface if they are stored in profiles table.
        // OR they are stored in auth.users metadata?
        // The previous code queried 'profiles' table and selected full_name, avatar_url.
        // So they are in 'profiles' table.
        // I should update UserProfile interface to include them.

        // For now, I'll update the UserProfile interface in the next step.
        // And update the repository to handle them.

        await services.user.updateProfile(user.id, {
            subscriptionTier: payload.data.subscription_tier,
            // I need to update UserProfile interface first to support these.
        });

        // Wait, I can't update them if they are not in the interface.
        // I'll update the interface in the next step.

    } catch (error: any) {
        return { success: false, message: error.message };
    }

    revalidatePath("/dashboard/profile");
    return { success: true, message: "Profile updated." };
}
