import * as pino from 'pino';
import {Server, Request, Response, Next} from 'restify';
import * as restify from 'restify';
import {createConnection} from "typeorm";
import {Connection} from "typeorm/connection/Connection";
import {UsersController} from "../modules/user/users.controller";
import {MonitoringResultsController} from "../modules/monitoringResult/monitoring-results.controller";
import {MonitoredEndpoint} from "../modules/monitoredEndpoint/monitored-endpoints.entity";
import CronService from "./cron/cron.service";
import {MonitoredEndpointsController} from "../modules/monitoredEndpoint/monitored-endpoints.controller";

export default class App {

    public static database: Connection;

    public static logger = pino();

    private port: number = parseInt(process.env.PORT, 10) || 3000;

    private server: Server;

    private databaseInstance: Connection;

    private cronService: CronService;

    public async run(): Promise<void> {
        try {
            App.logger.info(`Server starting at PORT: ${this.port}`);

            this.server = this.setupHttp();
            await this.database();
            this.middlewares();
            this.routes();
            await this.initCronService();

            this.server.on("error", (err: Error) => {
                App.logger.error("Could not start a server", err);
            });

            this.server.listen(this.port, () => {
                App.logger.info(`Listening at http://localhost:${this.port}/`);
            });
        } catch (error) {
            App.logger.error(error);
        }
    }

    public getServer(): Server {
        return this.server;
    }

    public getCronService(): CronService {
        return this.cronService;
    }

    public setupHttp(): Server {
        return restify.createServer();
    }

    public stop = async (): Promise<void> => {
        this.server.close();
        await this.databaseInstance.close();
    }

    private database = async (): Promise<void> => {
        this.databaseInstance = App.database = await createConnection();
    }

    public getDatabase(): Connection {
        return this.databaseInstance;
    }

    private middlewares = (): void => {
        this.server.use(restify.plugins.queryParser());
        this.server.use(restify.plugins.jsonBodyParser());

        this.server.use(
            function crossOrigin(req,res,next){
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                return next();
            }
        );
    }

    private async initCronService(): Promise<void> {
        this.cronService = new CronService(this);
        const cronJobs = await this.getDatabase().getRepository(MonitoredEndpoint).find();
        cronJobs.forEach(job => {
           this.cronService.addInterval({
               name: job.name,
               cbName: 'fetch',
               options: {
                   url: job.url,
                   timeout: job.monitored_interval,
                   endpointId: job.id
               }
           });
        });
    }

    public clearCronJobs(): void {
        this.cronService.clearIntervals();
    }

    private routes = (): void => {

        const usersController = new UsersController();
        const monitoringResultsController = new MonitoringResultsController();
        const monitoredEndpointsController = new MonitoredEndpointsController();

        usersController.initialize(this);
        monitoringResultsController.initialize(this);
        monitoredEndpointsController.initialize(this);

        this.server.get('/health-check', (req: Request, res: Response) => {
            App.logger.debug('Health check');
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
