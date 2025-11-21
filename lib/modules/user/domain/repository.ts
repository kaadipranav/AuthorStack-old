import { User, UserProfile, UserID } from "./types";

export interface UserRepository {
    getCurrentUser(): Promise<User | null>;
    getUserById(id: UserID): Promise<User | null>;
    getProfile(id: UserID): Promise<UserProfile | null>;
    updateProfile(id: UserID, data: Partial<UserProfile>): Promise<void>;
}
