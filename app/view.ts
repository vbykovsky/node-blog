import path from "path";
import { Liquid } from "liquidjs";

export class View {
    private engine: Liquid;
    protected templatesPath = path.resolve(__dirname, "..", "views", "templates");

    constructor() {
        this.engine = new Liquid()
    }

    protected getTemplateFile(templateName: string){
        return path.resolve(this.templatesPath, `${templateName}.liquid`)
    }

    protected renderText<T extends object>(text: string, vars: T) {
        const tpl = this.engine.parse(text);

        return this.engine.renderSync(tpl, vars);
    }

    protected renderFile<T extends object>(filePath: string, vars?: T) {
        return this.engine.renderFileSync(filePath, vars);
    }

    renderError(error: number){
        return this.engine.renderFileSync(this.getTemplateFile(error.toString()));
    }
};