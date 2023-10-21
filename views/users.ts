import { View } from "./common/view";

import { User } from "../models/user";

import { RequestAuthorization } from "../controllers/controllers";

export class UsersView extends View {
    getAll(authorization: RequestAuthorization, users: User[]) {
        return this.renderFile(this.getTemplateFile("users"), {
            authorization,
            data: users,
        });
    }
}