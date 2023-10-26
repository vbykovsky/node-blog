import { Model } from "sequelize";

import { User } from "./user";
import { Comment } from "./comment";

export interface Article {
    id: number;

    title: string;
    tags: string;

    content: string;

    authorId: number;
    author: User;

    comments?: Comment[];

    createdAt: Date;
    updatedAt: Date;
}

export type ArticleCreate = Omit<Article, "id" | "author" | "createdAt" | "updatedAt">;
export type ArticleAttributes = Omit<Article, "id" | "author" | "createdAt" | "updatedAt">

export type ArticleModel = Model<Article, ArticleCreate>;
