import { Article } from "../models/article";

export interface UpdateArticleDTO extends Pick<Article, "title" | "tags" | "content" | "previewText"> {
}