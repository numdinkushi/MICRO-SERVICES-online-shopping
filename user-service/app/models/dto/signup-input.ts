import { Length } from "class-validator";
import { LoginInput } from "./login-input";

export class SignupInput extends LoginInput {
    @Length(10, 15)
    phone: string;
}