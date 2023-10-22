import { View } from "../app/view";

export class AuthView extends View {
    login() {
        return this.renderFile(this.getTemplateFile("login"));
    }

    registration() {
        return this.renderFile(this.getTemplateFile("registration"));
    }
}