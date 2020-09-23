import {Request, Response, Server} from "restify";
import {Controller} from "../controller.interface";
import {apiKeyAuthMiddleware} from "../../core/auth";
import App from "../../core/server";
import {MonitoringResult} from "./monitoring-results.entity";

export class MonitoringResultsController implements Controller {
    public initialize = (httpServer: Server): void => {
        httpServer.get('/monitoring-results', [apiKeyAuthMiddleware, this.list]);
    }

    private async list(req: Request, res: Response) {
        const results = App.database.getRepository(MonitoringResult).find({
            take: req.params.limit
        });
        return res.json(200, results);
    }
}