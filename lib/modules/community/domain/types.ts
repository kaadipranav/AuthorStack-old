export type PostID = string;
export type CommentID = string;

export interface Post {
    id: PostID;
    authorId: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Comment {
    id: CommentID;
    postId: PostID;
    authorId: string;
    content: string;
    createdAt: Date;
}
