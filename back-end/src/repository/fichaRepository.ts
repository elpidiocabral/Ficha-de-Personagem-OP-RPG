import { IFichaRepository } from "../interfaces/IFicha";
import { ObjectId } from "mongodb";

import { getDatabase } from "../config/database";

export class FichaRepository implements IFichaRepository {
    private collectionName: string = "fichas";

    constructor() { }

    async createFicha(ficha: any): Promise<void> {
        const db = await getDatabase();
        await db.collection(this.collectionName).insertOne(ficha);
    }
    async getFichaByUSerId(userId: string): Promise<any[]> {
        const db = await getDatabase();
        return await db.collection(this.collectionName).find({ userId }).toArray();
    }
    async updateFicha(fichaId: string, ficha: any): Promise<void> {
        const db = await getDatabase();
        await db.collection(this.collectionName).updateOne({ _id: new ObjectId(fichaId) }, { $set: ficha });
    }
    async deleteFicha(fichaId: string): Promise<void> {
        const db = await getDatabase();
        await db.collection(this.collectionName).deleteOne({ _id: new ObjectId(fichaId) });
    }

}