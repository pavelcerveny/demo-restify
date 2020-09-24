import {Connection} from "typeorm";
import App from "../../core/server";


export default class MonitoredEndpointsService {
    private readonly connection: Connection = App.database;
    private app: App;

    public constructor(app: App) {
        this.app = app;
    }


    public async getEndpoints(limit?: number, offset?: number) {

    }

    public async getEndpointById(id: number) {

    }

    public async createEndpoint() {

    }

    public updateEndpoint() {

    }

    public deleteEndpoint() {

    }
}