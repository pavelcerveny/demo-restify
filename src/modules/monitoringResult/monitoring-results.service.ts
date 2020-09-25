import App from "../../core/server";
import {MonitoringResult} from "./monitoring-results.entity";

export default class MonitoringResultsService {

    public static DEFAULT_LIMIT: number = 10;

    public constructor(private readonly app: App) {
    }

    public async getResults(limit?: number) {
        return await this.app.getDatabase().getRepository(MonitoringResult).find({
            take: limit ?? MonitoringResultsService.DEFAULT_LIMIT,
            order: {checked_at: "DESC"}
        });
    }
}