import { UserModel } from 'app/models/user-model';
import { DBClient } from 'app/utils/databaseClient';
import 'app/utils/dependencyInjection';
import { singleton } from "tsyringe";
import { DBOperation } from './db-operations';

@singleton()
export class UserRepository extends DBOperation {
    constructor() {
        super();
    }

    async createAccount({ phone, email, password, salt, userType }: UserModel) {

        const queryString =
            "INSERT INTO users (phone,email,password,salt,user_type) VALUES($1,$2,$3,$4,$5) RETURNING *";
        const values = [phone, email, password, salt, userType];
        console.log(777, 'creating user');

        const result = await this.executeQuery(queryString, values);

        if (result?.rowCount && result?.rowCount > 0) {
            return result.rows[0] as UserModel;
        }
    }

    async findAccount(email: string): Promise<UserModel> {
        const queryString =
            "SELECT user_id, email, password, phone, salt, verification_code, expiry FROM users WHERE email=$1";
        const values = [email];
        const result = await this.executeQuery(queryString, values);

        if (!result || (result?.rowCount && result.rowCount < 1)) {
            throw new Error(`User with email ${email} does not exist!`);
        }

        return result.rows[0] as UserModel;
    }

    async updateVerification(userId: string, code: number, expiry: Date) {

        const queryString =
            "UPDATE users  SET verification_code=$1, expiry=$2 WHERE user_id=$3 AND verified=FALSE RETURNING *";
        const values = [code, expiry, userId];
        const result = await this.executeQuery(queryString, values);

        if (result?.rowCount && result?.rowCount > 0) {
            return result.rows[0] as UserModel;
        }

        throw new Error("User already verified");
    }
    async updateVerifiedUser(userId: string) {

        const queryString =
            "UPDATE users  SET verified=TRUE WHERE user_id=$1 AND verified=FALSE RETURNING *";
        const values = [userId];
        const result = await this.executeQuery(queryString, values);

        if (result?.rowCount && result?.rowCount > 0) {
            return result.rows[0] as UserModel;
        }

        throw new Error("User already verified");
    }
}