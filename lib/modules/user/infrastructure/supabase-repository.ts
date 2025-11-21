import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UserRepository } from "../domain/repository";
import { User, UserProfile, UserID } from "../domain/types";

export class SupabaseUserRepository implements UserRepository {
    async getCurrentUser(): Promise<User | null> {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return null;

        return {
            id: user.id,
            email: user.email!,
            emailVerified: !!user.email_confirmed_at,
            createdAt: new Date(user.created_at),
            updatedAt: new Date(user.updated_at ?? user.created_at),
        };
    }

    async getUserById(id: UserID): Promise<User | null> {
        // For now, we can't easily get other users by ID without admin client.
        // Returning null is acceptable for MVP unless we need public profiles.
        return null;
    }

    async getProfile(id: UserID): Promise<UserProfile | null> {
        const supabase = await createSupabaseServerClient();
        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (!data) return null;

        return {
            id: data.id,
            username: data.username,
            bio: data.bio,
            website: data.website,
            subscriptionTier: data.subscription_tier ?? 'free',
        };
    }

    async updateProfile(id: UserID, data: Partial<UserProfile>): Promise<void> {
        const supabase = await createSupabaseServerClient();
        await supabase
            .from("profiles")
            .update({
                username: data.username,
                bio: data.bio,
                website: data.website,
                subscription_tier: data.subscriptionTier,
            })
            .eq("id", id);
    }
}
