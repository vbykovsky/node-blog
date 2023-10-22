import { View } from "../app/view";
import { RequestAuthentication } from "../app/requests";

import { Article } from "../models/article";

export class ArticlesView extends View {
    createForm(authentication: RequestAuthentication) {
        return this.renderFile(this.getTemplateFile("create-article"), { authentication })
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