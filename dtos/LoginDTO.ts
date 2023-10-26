import { User } from "../models/user";

export interface LoginDTO extends Pick<User, "username" | "password"> {
}