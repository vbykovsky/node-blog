import { RequestAuthenticatedHandler, RequestHandler, getFormData } from "../app/requests";
import { BadRequestError, NotFoundError, RequestError, UnauthorizedError } from "../app/errors";

import { ArticlesService } from "../services/articles";

import { ArticlesView } from "../views/articles";

import { ArticleCreate } from "../models/article";
import { CommentCreate } from "../models/comment";

class ArticlesController {
    private view = new ArticlesView();
    private service = new ArticlesService();

    createForm: RequestHandler = async (req, res) => {
        res.end(this.view.createForm(req.authentication));
    }

    create: RequestAuthenticatedHandler = async (req, res) => {
        try{
            const data = await getFormData<ArticleCreate>(req);

            if(!data.content || !data.tags || !data.title) {
                throw new BadRequestError("Invalid request data");
            }
    
            const article = await this.service.create(req.authentication.user, data);
    
            res
                .writeHead(302, { Location: `/${article.id}`})
                .end();
        }
        catch(error){
            if(error instanceof RequestError){
                res.statusCode = error.status;
                res.end(this.view.renderError(req.authentication, error.status, error.message));
                return;
            }

            if (error instanceof Error){
                res.statusCode = 500;
                res.end(this.view.renderError(req.authentication, 500, error.message));
            }
        }
    }

    getAll: RequestHandler = async (req, res) => {
        const articles = await this.service.getAll(req.query);

        res.end(this.view.articles(req.authentication, articles));
    }

    getById: RequestHandler = async (req, res) => {
        try{
            const { articleId } = req.params;

            if((+articleId).toString() !== articleId){
                res.statusCode = 404;
                res.end(this.view.renderError(req.authentication, 404));
                return;
            }
    
            const article = await this.service.getById(+articleId);
    
            res.end(this.view.article(req.authentication, article));
        }
        catch(error){
            if(error instanceof RequestError){
                res.statusCode = error.status;
                res.end(this.view.renderError(req.authentication, error.status, error.message));
                return;
            }

            if (error instanceof Error){
                res.statusCode = 500;
                res.end(this.view.renderError(req.authentication, 500, error.message));
            }
        }
    }

    delete: RequestAuthenticatedHandler = async (req, res) => {
        try{
            const { articleId } = req.params;
    
            if((+articleId).toString() !== articleId){
                throw new NotFoundError();
            }
    
            await this.service.delete(req.authentication.user, +articleId);
    
            res
                .writeHead(302, { Location: "/" })
                .end();
        }
        catch(error){
            if(error instanceof RequestError){
                res.statusCode = error.status;
                res.end(this.view.renderError(req.authentication, error.status, error.message));
                return;
            }

            if (error instanceof Error){
                res.statusCode = 500;
                res.end(this.view.renderError(req.authentication, 500, error.message));
            }
        }
    }

    createComment: RequestAuthenticatedHandler = async (req, res) => {
        try{
            const { articleId } = req.params;
    
            if((+articleId).toString() !== articleId){
                throw new NotFoundError();
            }
    
            const data = await getFormData<CommentCreate>(req);
    
            if(!data.text){
                throw new BadRequestError("Invalid request data");
            }
    
            await this.service.createComment(req.authentication.user, +articleId, data);
    
            res
                .writeHead(302, {
                    Location: `/${articleId}`
                })
                .end();
        }
        catch(error){
            if(error instanceof RequestError){
                res.statusCode = error.status;
                res.end(this.view.renderError(req.authentication, error.status, error.message));
                return;
            }

            if (error instanceof Error){
                res.statusCode = 500;
                res.end(this.view.renderError(req.authentication, 500, error.message));
            }
        }
    }

    deleteComment: RequestAuthenticatedHandler = async (req, res) => {
        try{
            const { articleId, commentId } = req.params;
    
            if((+articleId).toString() !== articleId){
                throw new NotFoundError();
            }
    
            if((+commentId).toString() !== commentId){
                throw new NotFoundError();
            }
    
            await this.service.deleteComment(req.authentication.user, +commentId);
    
            res
                .writeHead(302, { Location: `/${articleId}` })
                .end();
        }
        catch(error){
            if(error instanceof RequestError){
                res.statusCode = error.status;
                res.end(this.view.renderError(req.authentication, error.status, error.message));
                return;
            }

            if (error instanceof Error){
                res.statusCode = 500;
                res.end(this.view.renderError(req.authentication, 500, error.message));
            }
        }
    }
}

export const articlesController = new ArticlesController();