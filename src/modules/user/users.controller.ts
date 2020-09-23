import {Request, Response, Server} from "restify";
import {Controller} from "../controller.interface";

export class UsersController implements Controller {
    public initialize = (httpServer: Server): void => {
        httpServer.get('/monitored-events', this.list);
        httpServer.get('/monitored-events/:id', this.getById);
        httpServer.post('/monitored-events', this.create);
        httpServer.put('/monitored-events/:id', this.update);
        httpServer.del('/monitored-events/:id', this.remove);
    }

    private async list(req: Request, res: Response): Promise<void> {
        // res.send(await customerService.list());
    }

    private async getById(req: Request, res: Response): Promise<void> {
        // const customer = await customerService.getById(req.params.id);
        // res.send(customer ? 200 : 404, customer);
    }

    private async create(req: Request, res: Response): Promise<void> {
        // res.send(await customerService.create(req.body));
    }

    private async update(req: Request, res: Response): Promise<void> {
        // res.send(await customerService.update({...req.body, id: req.params.id}));
    }

    private async remove(req: Request, res: Response): Promise<void> {
        // try {
        //     await customerService.delete(req.params.id);
        //     res.send(200);
        // }
        // catch (e) {
        //     res.send(500);
        // }
    }
}