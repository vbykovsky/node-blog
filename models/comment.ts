import { Model } from "sequelize";

import { User } from "./user";

export interface Comment {
    id: number;

    articleId: number;

    text: string;

    authorId: number;
    author: User;

    createdAt: Date;
    updatedAt: Date;
}

export type CommentCreate = Omit<Comment, "id" | "author" | "createdAt" | "updatedAt">;
export type CommentAttributes = Omit<Comment, "id" | "author" | "createdAt" | "updatedAt">

export type CommentModel = Model<Comment, CommentCreate>;