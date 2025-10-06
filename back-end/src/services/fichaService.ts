import { IFichaRepository } from "../interfaces/IFicha";

export class FichaService {
    constructor(private repository: IFichaRepository) { }

    async createFicha(ficha: any, userId: string): Promise<void> {
        ficha.userId = userId;
        this.repository.createFicha(ficha);
    }

    async deleteFicha(fichaId: string): Promise<void> {
        this.repository.deleteFicha(fichaId);
    }

    async updateFicha(ficha: any, fichaId: string): Promise<void> {
        this.repository.updateFicha(fichaId, ficha);
    }

    async getFichasByUserId(userId: string): Promise<any[]> {
        return this.repository.getFichaByUSerId(userId);
    }
}