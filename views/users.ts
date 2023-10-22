import { View } from "../app/view";
import { RequestAuthentication } from "../app/requests";

import { User } from "../models/user";

export class UsersView extends View {
    users(authentication: RequestAuthentication, users: User[]) {
        return this.renderFile(this.getTemplateFile("users"), {
            authentication,
            data: users,
        });
    }
}