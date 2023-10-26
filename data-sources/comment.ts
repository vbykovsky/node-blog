import { Attributes, DataTypes, FindOptions, ModelStatic } from "sequelize";

import { sequelizeInstance } from "./sources/source";

import { CommentAttributes, CommentCreate, CommentModel, CommentModelWithIncludedAuthor } from "../models/comment";

interface CommentsRepository {
    create(createData: CommentCreate): Promise<CommentModel>;

    findAll(options?: FindOptions<Attributes<CommentModelWithIncludedAuthor>>): Promise<CommentModelWithIncludedAuthor[]>;
    findById(id: number): Promise<CommentModel | null>;
}

export class CommentsDataSource implements CommentsRepository {
    private userModel = sequelizeInstance.model("user");
    private articleModel = sequelizeInstance.model("article");

    private model = sequelizeInstance.define<CommentModel, CommentAttributes>("comment", {
        articleId: {
            type: DataTypes.INTEGER,

            references: {
                model: this.articleModel,
            }
        },

        text: DataTypes.TEXT,

        authorId: {
            type: DataTypes.INTEGER,

            references: {
                model: this.userModel,
            }
        },
    }, {
        tableName: "comments",
        timestamps: true,
    });

    private commentAuthorAssociation = this.model.belongsTo(this.userModel, {
        foreignKey: "authorId",
        as: "author",
    });

    private articleCommentAssociation = this.articleModel.hasMany(this.model, {
        foreignKey: "articleId",
        as: "comments",
    });

    create(createData: CommentCreate): Promise<CommentModel> {
        return this.model.create(createData);
    }

    findAll(options?: FindOptions<Attributes<CommentModelWithIncludedAuthor>>): Promise<CommentModelWithIncludedAuthor[]> {
        return (this.model as unknown as ModelStatic<CommentModelWithIncludedAuthor>).findAll({
            ...options,
            include: this.commentAuthorAssociation,
        });
    }

    findById(id: number): Promise<CommentModel | null> {
        return this.model.findByPk(id);
    }
}