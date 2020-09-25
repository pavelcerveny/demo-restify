import {Request, Response} from "restify";
import {Controller} from "../controller.interface";
import App from "../../core/server";
import MonitoredEndpointsService from "./monitored-endpoints.service";
import {apiKeyAuthMiddleware} from "../../core/auth/auth.service";
import {MonitoredEndpoint} from "./monitored-endpoints.entity";

export class MonitoredEndpointsController implements Controller {

    private monitoredEndpointsService: MonitoredEndpointsService;

    public initialize = (app: App): void => {
        app.getServer().get('/monitored-endpoints', [apiKeyAuthMiddleware, this.list.bind(this)]);
        app.getServer().get('/monitored-endpoints/:id', [apiKeyAuthMiddleware, this.getById.bind(this)]);
        app.getServer().post('/monitored-endpoints', [apiKeyAuthMiddleware, this.create.bind(this)]);
        app.getServer().put('/monitored-endpoints/:id', [apiKeyAuthMiddleware, this.update.bind(this)]);
        app.getServer().del('/monitored-endpoints/:id', [apiKeyAuthMiddleware, this.delete.bind(this)]);

        this.monitoredEndpointsService = new MonitoredEndpointsService(app);
    }

    private async list(req: Request, res: Response): Promise<void> {
        try {
            const items = await this.monitoredEndpointsService.getEndpoints(req?.params?.limit, req?.params?.offset);
            res.json(200, items);
        } catch (e) {
            App.logger.error(e);
            res.json(500, {message: 'internal error'});
        }
    }

    private async getById(req: Request, res: Response): Promise<void> {
        try {
            const items = await this.monitoredEndpointsService.getEndpoints(req?.params?.limit, req?.params?.offset);
            res.json(200, items);
        } catch (e) {
            res.json(500, {message: 'internal error'});
        }
    }

    private async create(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore
            const userId = req.user;
            const result = await this.monitoredEndpointsService.createEndpoint(req.body, userId);

            if (result instanceof MonitoredEndpoint) {
                res.json(201, {
                    id: result.id,
                    name: result.name,
                    url: result.url,
                    monitored_interval: result.monitored_interval,
                    username: result.user.username
                });
            } else {
                res.json(400, result);
            }
        } catch (e) {
            App.logger.error(e);
            res.json(500, {message: 'internal error'});
        }
    }

    private async update(req: Request, res: Response): Promise<void> {
        try {
            const items = await this.monitoredEndpointsService.getEndpoints(req?.params?.limit, req?.params?.offset);
            res.json(200, items);
        } catch (e) {
            res.json(500, {message: 'internal error'});
        }
    }

    private async delete(req: Request, res: Response): Promise<void> {
        try {
            const items = await this.monitoredEndpointsService.getEndpoints(req?.params?.limit, req?.params?.offset);
            res.json(200, items);
        } catch (e) {
            res.json(500, {message: 'internal error'});
        }
    }
}