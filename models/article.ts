import { DataTypes, Model } from "sequelize";

import { sequelizeInstance } from "../data-sources";

import { Comment } from "./comment";
import { User, UserModel } from "./user";

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

export const ArticleModel = sequelizeInstance.define<Model<Article, ArticleCreate>, ArticleAttributes>("article", {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    
    tags: DataTypes.STRING,

    authorId: {
        type: DataTypes.INTEGER,

        references: {
            model: UserModel,
        }
    }
}, {
    timestamps: true,
    tableName: "articles",
});

export const ArticleAuthorAssociation = ArticleModel.belongsTo(UserModel, { foreignKey: "authorId", as: "author" });
