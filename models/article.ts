import { Model } from "sequelize";

import { Comment } from "./comment";
import { User, UserModel } from "./user";

export interface Article {
    id: number;

    title: string;
    tags: string;

    content: string;
    previewText: string;

    authorId: number;
    author: User;

    comments?: Comment[];

    createdAt: Date;
    updatedAt: Date;
}

export type ArticleCreate = Omit<Article, "id" | "author" | "createdAt" | "updatedAt">;
export type ArticleAttributes = Omit<Article, "id" | "author" | "createdAt" | "updatedAt">

export type ArticleModel = Model<Article, ArticleCreate>;
export type ArticleModelWithIncludedAuthor = Model<Omit<Article, "author"> & { author: UserModel }, ArticleCreate>;
