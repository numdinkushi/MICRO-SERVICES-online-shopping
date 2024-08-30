import { Client } from "pg";

export const DBClient = async () => {
    const client = new Client({
        host: "127.0.0.1",
        database: "user_service",
        user: "root",
        password: "root",
    });
    
    // Establish the connection
    await client.connect();
    return client;
};
