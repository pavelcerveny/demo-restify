import {Request, Response} from "restify";
import {Controller} from "../controller.interface";
import App from "../../core/server";
import {apiKeyAuthMiddleware} from "../../core/auth/auth.service";
import MonitoringResultsService from "./monitoring-results.service";

export class MonitoringResultsController implements Controller {

    private monitoringResultsService: MonitoringResultsService;

    public initialize = (app: App): void => {
        app.getServer().get('/monitoring-results', [apiKeyAuthMiddleware, this.list.bind(this)]);
        this.monitoringResultsService = new MonitoringResultsService(app);
    }

    private async list(req: Request, res: Response): Promise<void> {
        try {
            const results = await this.monitoringResultsService.getResults(req.query?.name, req.query?.limit);

            if (results.success) {
                res.json(200, results);
            } else {
                res.json(400, results);
            }

        } catch (e) {
            App.logger.error(e);
            res.json(500, {message: 'internal error'});
        }

    }
}