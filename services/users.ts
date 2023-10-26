import { UsersDataSource } from "../data-sources/user";

export class UsersService {
    private dataSource = new UsersDataSource();

    getAll = async () => {
        const usersResults = await this.dataSource.findAll();

        return usersResults.map((user) => user.dataValues);
    }
}