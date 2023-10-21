import { DataTypes, Model } from "sequelize";

import { sequelizeInstance } from "../data-sources";

import { ArticleModel } from "./article";
import { User, UserModel } from "./user";

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

export const CommentModel = sequelizeInstance.define<Model<Comment, CommentCreate>, CommentAttributes>("comment", {
    articleId: {
        type: DataTypes.INTEGER,

        references: {
            model: ArticleModel,
        }
    },

    text: DataTypes.TEXT,

    authorId: {
        type: DataTypes.INTEGER,

        references: {
            model: UserModel,
        }
    },
}, {
    tableName: "comments",
    timestamps: true,
});

export const CommentAuthorAssociation = CommentModel.belongsTo(UserModel, {
    foreignKey: "authorId",
    as: "author",
})

export const ArticleCommentAssociation = ArticleModel.hasMany(CommentModel, {
    foreignKey: "articleId",
    as: "comments",
})