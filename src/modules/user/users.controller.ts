import {Request, Response} from "restify";
import {Controller} from "../controller.interface";
import App from "../../core/server";

export class UsersController implements Controller {
    public initialize = (app: App): void => {
        app.getServer().get('/users/:id', this.getById);
    }

    private async getById(req: Request, res: Response): Promise<void> {
        // const customer = await customerService.getById(req.params.id);
        // res.send(customer ? 200 : 404, customer);
    }
}