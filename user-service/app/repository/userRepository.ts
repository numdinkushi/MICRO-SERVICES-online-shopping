import 'app/utils/dependencyInjection';
import { singleton } from "tsyringe";

@singleton()
export class UserRepository {
    constructor() { }

    logSomething() {
        console.log('anyth guy');
    }
    async CreateUserOperation() {
        console.log('user created in db');
    }
}