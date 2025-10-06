import { IExampleRepository } from "../interfaces/IExample";

export class ExampleService {
    constructor(private repository: IExampleRepository) { }
    async getAllExamples(): Promise<any[]> {
        return await this.repository.findAllCollections();
    }

    async postExample(item: any): Promise<void> {
        await this.repository.postITem(item);
    }
}