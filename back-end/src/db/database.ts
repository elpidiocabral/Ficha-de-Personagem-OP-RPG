import { MongoClient, Db } from "mongodb";

const uri: string = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName: string = process.env.MONGODB_DB_NAME || "testdb";

let db: Db | null = null;
let client: MongoClient | null = null;

export async function getDatabase(): Promise<Db> {
    if (db) return db;
    if (!client) {
        client = new MongoClient(uri, {
            maxPoolSize: 10,
            wtimeoutMS: 2500,
        });
    }
    try {
        await client.connect();
        console.log("Conectado com sucesso ao MongoDB");
        db = client.db(dbName);

        // process.on("SIGINT", async () => await closeConnection());
        // process.on("SIGTERM", async () => await closeConnection());

        return db;
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error);
        throw error;
    }

}

export async function closeConnection() {
    if (client) {
        await client.close();
        console.log("Conexão com MongoDB fechada");
        client = null;
        db = null;
    }
}