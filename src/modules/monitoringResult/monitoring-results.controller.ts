import {Request, Response, Server} from "restify";
import {Controller} from "../controller.interface";
import {apiKeyAuthMiddleware} from "../../core/auth";
import App from "../../core/server";
import {MonitoringResult} from "./monitoring-results.entity";

export class MonitoringResultsController implements Controller {
    public static DEFAULT_LIMIT: number = 10;

    public initialize = (httpServer: Server): void => {
        httpServer.get('/monitoring-results', [apiKeyAuthMiddleware, this.list]);
    }

    private async list(req: Request, res: Response): Promise<void> {
        const results = await App.database.getRepository(MonitoringResult).find({
            take: req.params.limit ?? MonitoringResultsController.DEFAULT_LIMIT,
            order: {checked_at: "DESC"}
        });
        res.json(200, results);
    }
}