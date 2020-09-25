import App from "../../core/server";
import {MonitoredEndpoint} from "./monitored-endpoints.entity";
import {validate} from "class-validator";
import {User} from "../user/user.entity";
import {FindManyOptions} from "typeorm";

interface Endpoint {
    name: string;
    url: string;
    monitored_interval: number;
}

interface ValidationError {
    property: string;
    value: string;
    err: any[];
}

export default class MonitoredEndpointsService {

    public constructor(private readonly app: App) {
    }

    public async getEndpoints(limit?: number, offset?: number): Promise<MonitoredEndpoint[]> {
        const options: FindManyOptions = {};
        if (limit) {
            options.take = limit;
        }
        if (offset) {
            options.skip = offset;
        }
        return this.app.getDatabase().getRepository(MonitoredEndpoint).find(options);
    }

    public async getEndpointById(id: number): Promise<MonitoredEndpoint> {
        return this.app.getDatabase().getRepository(MonitoredEndpoint).findOne(id);
    }

    public async createEndpoint(endpointData: Endpoint, userId: number): Promise<MonitoredEndpoint|any[]> {

        const endpoint = new MonitoredEndpoint();
        endpoint.name = endpointData.name;
        endpoint.url = endpointData.url;
        endpoint.monitored_interval = endpointData.monitored_interval;
        endpoint.user = await this.app.getDatabase().getRepository(User).findOne(userId);

       const validationErrors = await this.dataValidation<MonitoredEndpoint>(endpoint);

        if (validationErrors.length) {
            return Promise.resolve(validationErrors);
        } else {
            return this.app.getDatabase().getRepository(MonitoredEndpoint).save(endpoint);
        }
    }

    public async dataValidation<T>(data: T): Promise<ValidationError[]> {
        const validationErrors = [];
        const errors = await validate(data);

        if (errors.length > 0) {
            errors.forEach((err) => {
                validationErrors.push({
                    property: err.property,
                    value: err.value,
                    err: err.constraints
                });
            });
        }

        return validationErrors;
    }

    public async updateEndpoint(id: number, endpointData: Endpoint): Promise<MonitoredEndpoint|any[]> {
        const monitoredEndpoint: MonitoredEndpoint = await this.app.getDatabase().getRepository(MonitoredEndpoint).findOne(id);
        monitoredEndpoint.name = endpointData.name;
        monitoredEndpoint.url = endpointData.url;
        monitoredEndpoint.monitored_interval = endpointData.monitored_interval;

        const validationErrors = await this.dataValidation<MonitoredEndpoint>(monitoredEndpoint);

        if (validationErrors.length) {
            return Promise.resolve(validationErrors);
        } else {
            this.app.getCronService().deleteInterval(monitoredEndpoint.name);
            this.app.getCronService().addInterval({
                name: endpointData.name,
                cbName: 'fetch',
                options: {
                    url: endpointData.url,
                    timeout: endpointData.monitored_interval,
                    endpointId: id
                }
            });
            return this.app.getDatabase().getRepository(MonitoredEndpoint).save(monitoredEndpoint);
        }
    }

    public deleteEndpoint(id: number): Promise<MonitoredEndpoint> {
        return this.app.getDatabase().getRepository(MonitoredEndpoint).remove(id);
    }
}