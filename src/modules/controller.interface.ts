import App from "../core/server";

export interface ValidationError {
    property: string;
    value: string | number;
    err: string | any[];
}

export interface CronJobError {
    message: string;
}

export interface ServiceResponse<T = any> {
    success: boolean;
    data?: any | any[];
    message?: string;
    error?: ValidationError | ValidationError[] | CronJobError;
}

export interface Controller {
    initialize(app: App): void;
}
