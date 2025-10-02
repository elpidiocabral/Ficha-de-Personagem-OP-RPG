export interface IExampleRepository {
    findAllCollections(): Promise<any[]>;
    postITem(item: any): Promise<void>;
}