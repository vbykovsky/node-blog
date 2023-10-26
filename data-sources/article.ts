import { Attributes, DataTypes, FindOptions } from "sequelize";

import { sequelizeInstance } from "./sources/source";

import { ArticleAttributes, ArticleCreate, ArticleModel } from "../models/article";

interface ArticlesRepository {
    create(createData: ArticleCreate): Promise<ArticleModel>;

    findAll(options?: FindOptions<Attributes<ArticleModel>>): Promise<ArticleModel[]>;
    findById(id: number): Promise<ArticleModel | null>;
}

export class ArticlesDataSource implements ArticlesRepository {
    private userModel = sequelizeInstance.model("user");

    private model = sequelizeInstance.define<ArticleModel, ArticleAttributes>("article", {
        title: DataTypes.STRING,
        content: DataTypes.TEXT,
        
        tags: DataTypes.STRING,
    
        authorId: {
            type: DataTypes.INTEGER,
    
            references: {
                model: this.userModel,
            }
        }
    }, {
        timestamps: true,
        tableName: "articles",
    });

    private articleAuthorAssociation = this.model.belongsTo(this.userModel, { foreignKey: "authorId", as: "author" });

    create(createData: ArticleCreate): Promise<ArticleModel> {
        return this.model.create(createData);
    }

    findAll(options?: FindOptions<Attributes<ArticleModel>>): Promise<ArticleModel[]> {
        return this.model.findAll({
            ...options,
            include: this.articleAuthorAssociation
        });
    }

    findById(id: number): Promise<ArticleModel | null> {
        return this.model.findByPk(id, {
            include: this.articleAuthorAssociation,
        });
    }
}