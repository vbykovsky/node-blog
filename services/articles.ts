import { Op } from "sequelize";

import { BadRequestError, NotFoundError } from "../app/errors";

import { ArticlesDataSource } from "../data-sources/article";
import { CommentsDataSource } from "../data-sources/comment";

import { User } from "../models/user";
import { Article } from "../models/article";

import { CreateArticleDTO } from "../dtos/CreateArticleDTO";
import { CreateCommentDTO } from "../dtos/CreateCommentDTO";
import { UpdateArticleDTO } from "../dtos/UpdateArticleDTO";

export class ArticlesService {
    private articlesDataSource = new ArticlesDataSource();
    private commentsDataSource = new CommentsDataSource();

    create = async (user: User, createArticleDto: CreateArticleDTO) => {
        const articleResult = await this.articlesDataSource.create({
            ...createArticleDto,
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
            author: article.dataValues.author.dataValues
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
            author: comment.dataValues.author.dataValues,
        }))
        
        const article: Article = ({
            ...articleResult.dataValues,
            author: articleResult.dataValues.author.dataValues,
            comments: comments,
        });

        return article;
    }

    update = async (articleId: number, updateDto: UpdateArticleDTO) => {
        const articleResult = await this.articlesDataSource.findById(articleId);

        if(!articleResult){
            throw new NotFoundError();
        }

        articleResult.set("title", updateDto.title);
        articleResult.set("tags", updateDto.tags);
        articleResult.set("content", updateDto.content);
        articleResult.set("previewText", updateDto.previewText);

        await articleResult.save();

        return articleResult.dataValues;
    }

    delete = async (user: User, articleId: number) => {
        const articleResult = await this.articlesDataSource.findById(articleId);

        if(!articleResult){
            throw new NotFoundError();
        }

        if(articleResult.dataValues.authorId !== user.id){
            throw new BadRequestError("Only author of article can delete it");
        }

        await articleResult.destroy();
    }

    createComment = async (user: User, articleId: number, createCommentDto: CreateCommentDTO) => {
        return this.commentsDataSource.create({
            ...createCommentDto,
            authorId: user.id,
            articleId: +articleId,
        })
    }

    deleteComment = async (user: User, commentId: number) => {
        const commentResult = await this.commentsDataSource.findById(commentId);

        if(!commentResult){
            throw new NotFoundError();
        }

        if(commentResult.dataValues.authorId !== user.id){
            throw new BadRequestError("Only author of comment can delete it");
        }

        await commentResult.destroy();
    }
}