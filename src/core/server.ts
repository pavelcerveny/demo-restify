import * as pino from 'pino';
import {RequestHandler, Server, Request, Response, Next} from 'restify';
import * as restify from 'restify';
import {BaseError, NotFoundError} from "./errors";
import {createConnection} from "typeorm";
import {Connection} from "typeorm/connection/Connection";
import {UsersController} from "../modules/user/users.controller";
import {MonitoringResultsController} from "../modules/monitoringResult/monitoring-results.controller";

export default class App {

    private port: number = parseInt(process.env.PORT, 10) || 3000;

    private server: Server;

    private databaseInstance: Connection;

    public static database: Connection;

    private logger = pino({

    });

    public async run(): Promise<void> {
        try {
            this.logger.info(`Server starting at PORT: ${this.port}`);

            this.server = this.setupHttp();
            await this.database();
            this.middlewares();
            this.routes();

            this.server.on("error", (err: Error) => {
                this.logger.error("Could not start a server", err);
            });

            this.server.listen(this.port, () => {
                this.logger.info(`Listening at http://localhost:${this.port}/`);
            });
        } catch (error) {
            this.logger.error(error);
        }
    }

    public setupHttp(): Server {
        return restify.createServer();
    }

    public stop = (): void => {
        this.server.close();
    }

    private database = async (): Promise<void> => {
        this.databaseInstance = App.database = await createConnection();
    }

    public getDatabase(): Connection {
        return this.databaseInstance;
    }

    private middlewares = (): void => {
        this.server.use(restify.plugins.queryParser());
        this.server.use(restify.plugins.bodyParser());
        this.server.use(restify.plugins.jsonBodyParser());

        this.server.use(
            function crossOrigin(req,res,next){
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                return next();
            }
        );
    }

    private routes = (): void => {

        const usersController = new UsersController();
        const monitoringResultsController = new MonitoringResultsController();
        usersController.initialize(this.server);
        monitoringResultsController.initialize(this.server);

        this.server.get('/health-check', (req: Request, res: Response, next: Next) => {
            this.logger.debug('Health check');
            res.json({
                status: "ok",
            });
        });

        // this.server.use("*", (req: Request, res: Response) => {
        //     this.logger.warn(`Non existing route: ( ${req.method} ) ${req.originalUrl}`);
        //     throw new NotFoundError("Route not found.");
        // });
        //
        // // use centralized error handler
        // this.express.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        //
        //     if (!(err instanceof BaseError)) {
        //         this.logger.error(err);
        //         res.status(500)
        //             .json({message: 'Unknown error'});
        //     }
        //
        //     this.logger.error(`Status: ${err.status}: ${err.message}`);
        //
        //     res.status(err.status)
        //         .send({message: err.message});
        // });
    }

}
