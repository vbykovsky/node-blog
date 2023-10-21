import { Article } from "../models/article";

import { View } from "./common/view";

import { RequestAuthorization } from "../controllers/controllers";

export class ArticlesView extends View {
    createForm(authorization: RequestAuthorization) {
        return this.renderFile(this.getTemplateFile("create-article"), { authorization })
    }

    getAll(authorization: RequestAuthorization, articles: Article[]){
        return this.renderFile(this.getTemplateFile("articles"), {
            authorization,
            data: articles.map((article) => ({
                ...article,
                tags: article.tags.split(","),
                createdAt: article.createdAt.toDateString(),
                updatedAt: article.createdAt.toDateString(),
            }))
        })
    }

    get(authorization: RequestAuthorization, article: Article){
        return this.renderFile(this.getTemplateFile("article"), {
            authorization,
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