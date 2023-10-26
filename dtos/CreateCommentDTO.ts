import { Comment } from "../models/comment";

export interface CreateCommentDTO extends Pick<Comment, "text"> {
}