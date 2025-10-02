import { IExampleRepository } from "../interfaces/IExample";
import { getDatabase } from "../db/database"

export class exampleRepository implements IExampleRepository {
    private collectionName: string = "examples";

    constructor() { }

    async findAllCollections(): Promise<any[]> {
        const db = await getDatabase();
        return await db.collection(this.collectionName).find().toArray();
    }

    async postITem(item: any): Promise<void> {
        const db = await getDatabase();
        await db.collection(this.collectionName).insertOne(item);
    }
}