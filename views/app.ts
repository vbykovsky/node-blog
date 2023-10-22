import { View } from "../app/view";

export class AppView extends View {
    index() {
        return this.renderFile(this.getTemplateFile("index"));
    }
}