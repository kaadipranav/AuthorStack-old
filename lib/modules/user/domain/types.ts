export type UserID = string;

export interface User {
    id: UserID;
    email: string;
    emailVerified: boolean;
    fullName?: string;
    avatarUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserProfile {
    id: UserID;
    username?: string;
    bio?: string;
    website?: string;
    subscriptionTier: 'free' | 'pro' | 'enterprise';
}
