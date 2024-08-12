import { UserModel } from 'app/models/user-model';
import { DBClient } from 'app/utils/databaseClient';
import 'app/utils/dependencyInjection';
import { singleton } from "tsyringe";

@singleton()
export class UserRepository {
    constructor() { }

    async createAccount({ phone, email, password, salt, userType }: UserModel) {
        const Client = await DBClient();
        await Client.connect();

        const queryString =
            "INSERT INTO users (phone,email,password,salt,user_type) VALUES($1,$2,$3,$4,$5) RETURNING *";
        const values = [phone, email, password, salt, userType];
        const result = await Client.query(queryString, values);
        await Client.end();

        if (result?.rowCount && result?.rowCount > 0) {
            return result.rows[0] as UserModel;
        }
    }

    async findAccount(email: string) {
        console.log(788, email)
        const Client = await DBClient();
        await Client.connect();

        const queryString =
            "SELECT user_id, email, password, phone, salt FROM users WHERE email=$1";
        const values = [email];
        const result = await Client.query(queryString, values);
        await Client.end();

        if (result?.rowCount !== null && result?.rowCount < 1) {
            throw new Error(`User with ID ${email} does not exist!`);
        }

        if (result?.rowCount && result?.rowCount > 0) {
            return result.rows[0] as UserModel;
        }
    }
}