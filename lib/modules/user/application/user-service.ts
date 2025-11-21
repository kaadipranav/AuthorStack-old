import { UserRepository } from "../domain/repository";
import { User, UserProfile } from "../domain/types";

export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async getCurrentUser(): Promise<User | null> {
        return this.userRepository.getCurrentUser();
    }

    async getCurrentProfile(): Promise<UserProfile | null> {
        const user = await this.userRepository.getCurrentUser();
        if (!user) return null;
        return this.userRepository.getProfile(user.id);
    }

    async updateProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
        return this.userRepository.updateProfile(userId, data);
    }
}
