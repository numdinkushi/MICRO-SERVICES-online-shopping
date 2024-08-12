import { UserModel } from "app/models/user-model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const APP_SECRET = 'our_app_secret';

export const GetSalt = async (): Promise<string> => {
    return await bcrypt.genSalt();
};

export const GetHashedPassword = async (password: string, salt: string): Promise<string> => {
    return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (enteredPassword: string, savedPassword: string, salt: string): Promise<boolean> => {
    const hashedPassword = await GetHashedPassword(enteredPassword, salt);
    return hashedPassword === savedPassword;
};

export const GeToken = async ({ email, user_id, phone, userType }: UserModel): Promise<string> => {
    const token = jwt.sign({ user_id, email, phone, userType }, APP_SECRET, { expiresIn: '30d' });
    return token;
};

export const VerifyToken = async (token: string): Promise<UserModel | false> => {
    try {
        if (token) {
            const payload = await jwt.verify(token.split(' ')[1], APP_SECRET);
            return payload as UserModel;
        }
        return false;
    } catch (error) {
        console.log('Error verifying token', error);
        return false;
    }
};