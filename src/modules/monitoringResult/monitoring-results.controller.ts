import {Request, Response} from "restify";
import {Controller} from "../controller.interface";
import App from "../../core/server";
import {apiKeyAuthMiddleware} from "../../core/auth/auth.service";
import MonitoringResultsService from "./monitoring-results.service";

export class MonitoringResultsController implements Controller {

    private monitoringResultsService: MonitoringResultsService;

    public initialize = (app: App): void => {
        app.getServer().get('/monitoring-results', [apiKeyAuthMiddleware, this.list]);
        this.monitoringResultsService = new MonitoringResultsService(app);
    }

    private async list(req: Request, res: Response): Promise<void> {
        const results = this.monitoringResultsService.getResults(req.params?.limit);
        res.json(200, results);
    }
}