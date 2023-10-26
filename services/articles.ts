import { Op } from "sequelize";

import { NotFoundError } from "../app/errors";

import { ArticlesDataSource } from "../data-sources/article";
import { CommentsDataSource } from "../data-sources/comment";

import { User, UserModel } from "../models/user";
import { Article, ArticleCreate } from "../models/article";
import { CommentCreate } from "../models/comment";

export class ArticlesService {
    private articlesDataSource = new ArticlesDataSource();
    private commentsDataSource = new CommentsDataSource();

    create = async (user: User, data: ArticleCreate) => {
        const articleResult = await this.articlesDataSource.create({
            ...data,
            authorId: user.id,
        });

        return articleResult.dataValues;
    }

    getAll = async (query?: { tag?: string }) => {
        const articlesResults = await this.articlesDataSource.findAll({
            where: query?.tag ? { tags: { [Op.substring]: query?.tag } } : undefined,
            order:[["createdAt", "DESC"]],
        });

        const articles = articlesResults.map((article) => ({
            ...article.dataValues,
            author: (article.dataValues.author as unknown as UserModel).dataValues
        }));

        return articles;
    }

    getById = async (articleId: number) => {
        const articleResult = await this.articlesDataSource.findById(articleId);

        if(!articleResult){
            throw new NotFoundError();
        }

        const commentsResult = await this.commentsDataSource.findAll({
            where: { articleId: articleResult.dataValues.id },
            order:[["createdAt", "ASC"]],
        });

        const comments = commentsResult.map((comment) => ({
            ...comment.dataValues,
            author: (comment.dataValues.author  as unknown as UserModel).dataValues,
        }))
        
        const article: Article = ({
            ...articleResult.dataValues,
            author: (articleResult.dataValues.author as unknown as UserModel).dataValues,
            comments: comments,
        });

        return article;
    }

    createComment = async (user: User, articleId: number, data: CommentCreate) => {
        return this.commentsDataSource.create({
            ...data,
            authorId: user.id,
            articleId: +articleId,
        })
    }
}