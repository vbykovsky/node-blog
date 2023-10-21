import { View } from "./common/view";

export class AppView extends View {
    index() {
        return this.renderFile(this.getTemplateFile("index"));
    }
}