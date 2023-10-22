import { Model, Op } from "sequelize";

import { User } from "../models/user";
import { CommentAuthorAssociation, CommentCreate, CommentModel } from "../models/comment";
import { ArticleCreate, ArticleModel, ArticleAuthorAssociation, Article } from "../models/article";

import { ArticlesView } from "../views/articles";

import { RequestHandler, getFormData } from "../app/requests";

class ArticlesController {
    private view = new ArticlesView();

    create: RequestHandler = async(req, res) => {
        if(req.method === "POST"){
            if(!req.authentication.isAuthenticated){
                res.statusCode = 401;
                res.end(this.view.renderError(401));
                return;
            }

            const data = await getFormData<ArticleCreate>(req);

            if(!data.content || !data.tags || !data.title) {
                res.statusCode = 400;
                res.end(this.view.renderError(400));
                return;
            }
    
            const articleResult = await ArticleModel.create({
                ...data,
                authorId: req.authentication.user.id,
            });
    
            res.writeHead(302, {
                Location: `/${articleResult.dataValues.id}`
            });
            res.end();
            return;
        }

        res.end(this.view.createForm(req.authentication));
        return;
    }

    getAll: RequestHandler = async (req, res) => {
        const { tag } = req.query;

        const articlesResults = await ArticleModel.findAll({
            where: tag ? { tags: { [Op.substring]: tag } } : undefined,
            order:[["createdAt", "DESC"]],
            include: ArticleAuthorAssociation,
        });

        const articles = articlesResults.map((article) => ({
            ...article.dataValues,
            author: (article.dataValues.author as unknown as Model<User>).dataValues
        }))

        res.end(this.view.articles(req.authentication, articles));
        return;
    }

    getById: RequestHandler = async (req, res) => {
        const { articleId } = req.params;

        if((+articleId).toString() !== articleId){
            res.statusCode = 404;
            res.end(this.view.renderError(404));
            return;
        }

        const articleResult = await ArticleModel.findByPk(articleId, {
            include: ArticleAuthorAssociation,
        });

        if(!articleResult){
            res.statusCode = 404;
            res.end(this.view.renderError(404));
            return;
        }

        const commentsResult = await CommentModel.findAll({
            where: { articleId: articleResult.dataValues.id },
            order:[["createdAt", "ASC"]],
            include: CommentAuthorAssociation,
        });

        const comments = commentsResult.map((comment) => ({
            ...comment.dataValues,
            author: (comment.dataValues.author  as unknown as Model<User>).dataValues,
        }))
        
        const article: Article = ({
            ...articleResult.dataValues,
            author: (articleResult.dataValues.author as unknown as Model<User>).dataValues,
            comments: comments,
        });

        res.end(this.view.article(req.authentication, article));
        return;
    }

    createComment: RequestHandler = async (req, res) => {
        if(!req.authentication.isAuthenticated){
            res.statusCode = 401;
            res.end(this.view.renderError(401));
            return;
        }

        const { articleId } = req.params;

        if((+articleId).toString() !== articleId){
            res.statusCode = 404;
            res.end(this.view.renderError(404));
            return;
        }

        const data = await getFormData<CommentCreate>(req);

        await CommentModel.create({
            ...data,
            articleId: +articleId,
            authorId: req.authentication.user.id,
        });

        res.writeHead(302, {
            Location: `/${articleId}`
        });
        res.end();
        return;
    }
}

export const articlesController = new ArticlesController();