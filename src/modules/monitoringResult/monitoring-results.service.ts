import App from "../../core/server";
import {MonitoringResult} from "./monitoring-results.entity";
import {ServiceResponse} from "../controller.interface";

export default class MonitoringResultsService {

    public static DEFAULT_LIMIT: number = 10;

    public constructor(private readonly app: App) {
    }

    public async getResults(name?: string, limit?: number): Promise<ServiceResponse<MonitoringResult[]>> {

        let take = MonitoringResultsService.DEFAULT_LIMIT;
        if (limit) {
            take = limit
        }

        if (name) {
            const results = await this.app.getDatabase()
                .getRepository(MonitoringResult)
                .createQueryBuilder("result")
                .innerJoinAndSelect("result.monitoredEndpoint", "monitoredEndpoint")
                .where("monitoredEndpoint.name = :name", {name})
                .take(take)
                .orderBy("result.id", "DESC")
                .loadAllRelationIds()
                .getMany();

            return {
                success: true,
                data: results
            }
        } else {
            return Promise.resolve(
                {
                    success: false,
                    error: {
                        property: 'name',
                        value: name,
                        err: 'property is missing'
                    }
                }
            );
        }
    }
}