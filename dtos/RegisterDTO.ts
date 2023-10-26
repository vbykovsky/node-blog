import { User } from "../models/user";

export interface RegisterDTO extends Pick<User, "username" | "password" | "displayName" | "avatar"> {
}