import {Server} from "restify";

export interface Controller {
    initialize(httpServer: Server): void;
}
