import { DBClient } from "app/utils/databaseClient";

export class DBOperation {
    constructor() {}

    async executeQuery(query: string, values: unknown[]) {
        try {
            const client = await DBClient();
            console.log('DB Client connected');
            const result = await client.query(query, values);
            console.log('Query executed successfully');
            await client.end();
            return result;
        } catch (error) {
            console.error('Error executing query:', error.message);
            throw error; // Re-throw the error to handle it in the calling function
        }
    }
}
