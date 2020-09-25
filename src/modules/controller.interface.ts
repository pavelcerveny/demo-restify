import App from "../core/server";

export interface Controller {
    initialize(app: App): void;
}
