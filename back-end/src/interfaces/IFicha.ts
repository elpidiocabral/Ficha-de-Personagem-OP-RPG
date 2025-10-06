export interface IFichaRepository {
    createFicha(ficha: any): Promise<void>;
    getFichaByUSerId(userId: string): Promise<any[]>;
    updateFicha(fichaId: string, ficha: any): Promise<void>;
    deleteFicha(fichaId: string): Promise<void>;
}