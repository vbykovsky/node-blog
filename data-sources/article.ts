import { Attributes, DataTypes, FindOptions, ModelStatic } from "sequelize";

import { sequelizeInstance } from "./sources/source";

import { ArticleAttributes, ArticleCreate, ArticleModel, ArticleModelWithIncludedAuthor } from "../models/article";

interface ArticlesRepository {
    create(createData: ArticleCreate): Promise<ArticleModel>;

    findAll(options?: FindOptions<Attributes<ArticleModelWithIncludedAuthor>>): Promise<ArticleModelWithIncludedAuthor[]>;
    findById(id: number): Promise<ArticleModelWithIncludedAuthor | null>;
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

    findAll(options?: FindOptions<Attributes<ArticleModelWithIncludedAuthor>>): Promise<ArticleModelWithIncludedAuthor[]> {
        return (this.model as unknown as ModelStatic<ArticleModelWithIncludedAuthor>).findAll({
            ...options,
            include: this.articleAuthorAssociation
        });
    }

    findById(id: number): Promise<ArticleModelWithIncludedAuthor | null> {
        return (this.model as unknown as ModelStatic<ArticleModelWithIncludedAuthor>).findByPk(id, {
            include: this.articleAuthorAssociation,
        });
    }
}