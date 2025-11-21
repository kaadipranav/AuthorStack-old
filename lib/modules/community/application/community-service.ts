import { CommunityRepository } from "../domain/repository";
import { Post, Comment } from "../domain/types";

export class CommunityService {
    constructor(private readonly communityRepository: CommunityRepository) { }

    async getRecentPosts(): Promise<Post[]> {
        return this.communityRepository.getPosts();
    }

    async createPost(authorId: string, title: string, content: string, tags: string[]): Promise<Post> {
        return this.communityRepository.createPost({
            authorId,
            title,
            content,
            tags,
        });
    }
}
