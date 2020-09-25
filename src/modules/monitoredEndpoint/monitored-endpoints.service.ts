import App from "../../core/server";
import {MonitoredEndpoint} from "./monitored-endpoints.entity";
import {isNumber, validate} from "class-validator";
import {User} from "../user/user.entity";
import {ServiceResponse, ValidationError} from "../controller.interface";

interface Endpoint {
    name: string;
    url: string;
    monitored_interval: number;
}

export default class MonitoredEndpointsService {

    public static DEFAULT_LIMIT: number = 10;

    public constructor(private readonly app: App) {
    }

    public async getEndpoints(limit?: number, offset?: number): Promise<ServiceResponse<MonitoredEndpoint[]>> {
        let take = MonitoredEndpointsService.DEFAULT_LIMIT;
        if (limit) {
            take = limit
        }

        let skip = 0;
        if (offset) {
            skip = offset;
        }

        const results = await this.app.getDatabase()
            .getRepository(MonitoredEndpoint)
            .createQueryBuilder("endpoint")
            .take(take)
            .skip(skip)
            .orderBy("endpoint.id", "DESC")
            .getMany();

        return {
            success: true,
            data: results
        }
    }

    public async getEndpointById(id: number): Promise<ServiceResponse<MonitoredEndpoint>> {

        if (id) {
            const data = await this.app.getDatabase().getRepository(MonitoredEndpoint).findOne(id);
            return {
                success: true,
                data
            }
        } else {
            return {
                success: false,
                error: {
                    property: 'id',
                    value: id,
                    err: 'property is missing'
                }
            };
        }
    }

    public async createEndpoint(endpointData: Endpoint, userId: number): Promise<ServiceResponse<MonitoredEndpoint>> {

        const endpoint = new MonitoredEndpoint();
        endpoint.name = endpointData.name;
        endpoint.url = endpointData.url;
        endpoint.monitored_interval = endpointData.monitored_interval;
        endpoint.user = await this.app.getDatabase().getRepository(User).findOne(userId);

       const validationErrors = await this.dataValidation<MonitoredEndpoint>(endpoint);

        if (validationErrors.length) {
            return {
                success: false,
                error: validationErrors
            };
        } else {
            if (!this.app.getCronService().getInterval(endpoint.name)) {
                const newEndpoint = await this.app.getDatabase().getRepository(MonitoredEndpoint).save(endpoint);
                this.app.getCronService().addInterval({
                    name: endpointData.name,
                    cbName: 'fetch',
                    options: {
                        url: endpointData.url,
                        timeout: endpointData.monitored_interval,
                        endpointId: newEndpoint.id
                    }
                });
                return {
                    success: true,
                    data: newEndpoint
                };
            } else {
                return {
                    success: false,
                    message: 'duplicate cron'
                };
            }
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

    public async updateEndpoint(id: number, endpointData: Endpoint): Promise<ServiceResponse<MonitoredEndpoint>> {
        const monitoredEndpoint: MonitoredEndpoint = await this.app.getDatabase().getRepository(MonitoredEndpoint).findOne(id)

        if (!monitoredEndpoint) {
            return {
                success: false,
                message: 'endpoint not found'
            };
        }

        monitoredEndpoint.name = endpointData.name;
        monitoredEndpoint.url = endpointData.url;
        monitoredEndpoint.monitored_interval = endpointData.monitored_interval;

        const validationErrors = await this.dataValidation<MonitoredEndpoint>(monitoredEndpoint);

        if (validationErrors.length) {
            return {
                success: false,
                error: validationErrors
            };
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
            console.log(this.app.getCronService().getIntervals())
            const updatedEndpoint = await this.app.getDatabase().getRepository(MonitoredEndpoint).save(monitoredEndpoint);
            return {
                success: true,
                data: updatedEndpoint
            };
        }
    }

    public async deleteEndpoint(id: number): Promise<ServiceResponse<MonitoredEndpoint>> {
        const monitoredEndpoint = await this.app.getDatabase().getRepository(MonitoredEndpoint).findOne(id);

        if (!monitoredEndpoint) {
            return {
                success: false,
                message: 'endpoint not found'
            };
        }

        if (this.app.getCronService().getInterval(monitoredEndpoint.name)) {
            this.app.getCronService().deleteInterval(monitoredEndpoint.name);
            const removedEndpoint = await this.app.getDatabase().getRepository(MonitoredEndpoint).remove(monitoredEndpoint);
            console.log(this.app.getCronService().getIntervals())
            return {
                success: true,
                data: removedEndpoint
            };
        }
    }
}