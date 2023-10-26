import { View } from "../app/view";
import { RequestAuthentication } from "../app/requests";

import { Article } from "../models/article";

import { UpdateArticleDTO } from "../dtos/UpdateArticleDTO";

export class ArticlesView extends View {
    createForm(authentication: RequestAuthentication) {
        return this.renderFile(this.getTemplateFile("article-form"), {
            authentication,
            title: "Create an article",
            submitText: "Create",
            action: "/create",
        })
    }

    updateForm(authentication: RequestAuthentication, articleId: number, defaultValues: Partial<UpdateArticleDTO> = {}) {
        return this.renderFile(this.getTemplateFile("article-form"), {
            authentication,
            title: "Update an article",
            submitText: "Update",
            action: `/${articleId}/update`,
            data: { articleId, defaultValues },
        })
    }

    articles(authentication: RequestAuthentication, articles: Article[]){
        return this.renderFile(this.getTemplateFile("articles"), {
            authentication,
            data: articles.map((article) => ({
                ...article,
                tags: article.tags.split(","),
                createdAt: article.createdAt.toDateString(),
                updatedAt: article.createdAt.toDateString(),
            }))
        })
    }

    article(authentication: RequestAuthentication, article: Article){
        return this.renderFile(this.getTemplateFile("article"), {
            authentication,
            data: {
                ...article,
                tags: article.tags.split(","),
                createdAt: article.createdAt.toDateString(),
                updatedAt: article.createdAt.toDateString(),
                comments: article.comments?.map((comment) => ({
                    ...comment,
                    createdAt: `${comment.createdAt.toDateString()}, ${comment.createdAt.toLocaleTimeString("en")}`,
                    updatedAt: `${comment.updatedAt.toDateString()}, ${comment.updatedAt.toLocaleTimeString("en")}`,
                }))
            }
        })
    }
}