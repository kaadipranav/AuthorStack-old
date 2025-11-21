import { Post, Comment } from "./types";

export interface CommunityRepository {
    getPosts(limit?: number, offset?: number): Promise<Post[]>;
    getPostById(id: string): Promise<Post | null>;
    createPost(post: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post>;
    addComment(comment: Omit<Comment, "id" | "createdAt">): Promise<Comment>;
}
