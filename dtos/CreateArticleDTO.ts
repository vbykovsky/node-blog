import { Article } from "../models/article";

export interface CreateArticleDTO extends Pick<Article, "title" | "tags" | "content" | "previewText"> {
}