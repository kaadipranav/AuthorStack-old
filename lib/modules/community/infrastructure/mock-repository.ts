import { CommunityRepository } from "../domain/repository";
import { Post, Comment } from "../domain/types";

export class MockCommunityRepository implements CommunityRepository {
    async getPosts(limit = 10, offset = 0): Promise<Post[]> {
        return [];
    }

    async getPostById(id: string): Promise<Post | null> {
        return null;
    }

    async createPost(post: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post> {
        return {
            id: crypto.randomUUID(),
            ...post,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }

    async addComment(comment: Omit<Comment, "id" | "createdAt">): Promise<Comment> {
        return {
            id: crypto.randomUUID(),
            ...comment,
            createdAt: new Date(),
        };
    }
}
