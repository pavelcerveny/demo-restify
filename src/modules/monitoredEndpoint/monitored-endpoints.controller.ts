import {Request, Response, Server} from "restify";
import {Controller} from "../controller.interface";
import {apiKeyAuthMiddleware} from "../../core/auth";
import App from "../../core/server";
import MonitoredEndpointsService from "./monitored-endpoints.service";

export class MonitoredEndpointsController implements Controller {
    public static DEFAULT_LIMIT: number = 10

    private monitoredEndpointsService: MonitoredEndpointsService;

    public initialize = (httpServer: Server): void => {
        httpServer.get('/monitored-endpoints', [apiKeyAuthMiddleware, this.list]);
        httpServer.get('/monitored-endpoints/:id', [apiKeyAuthMiddleware, this.getById]);
        httpServer.post('/monitored-endpoints', [apiKeyAuthMiddleware, this.create]);
        httpServer.put('/monitored-endpoints/:id', [apiKeyAuthMiddleware, this.update]);
        httpServer.del('/monitored-endpoints/:id', [apiKeyAuthMiddleware, this.delete]);

        this.monitoredEndpointsService = new MonitoredEndpointsService();
    }

    private async list(req: Request, res: Response): Promise<void> {
        try {
            const items = await this.monitoredEndpointsService.getEndpoints(req?.params?.limit, req?.params?.offset);
            res.json(200, items);
        } catch (e) {
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
            const items = await this.monitoredEndpointsService.getEndpoints(req?.params?.limit, req?.params?.offset);
            res.json(201, items);
        } catch (e) {
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