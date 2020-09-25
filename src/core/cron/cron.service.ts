import CronManager from "./cron.manager";
import FetchJob from "./jobs/fetch.job";
import App from "../server";

interface AddCronJob {
    name: string;
    cbName: string;
    options: {
        url: string,
        timeout: number,
        endpointId: number
    }
}

export default class CronService {

    private readonly cronManager: CronManager = new CronManager();

    public constructor(private readonly app: App) {
    }


    public addInterval(props: AddCronJob): void {
        if (!this.cronManager.getInterval(props.name)) {
            const intervalRef = setInterval(
                FetchJob,
                props.options.timeout * 1000,
                {
                    cronJob: {
                        url: props.options.url,
                        endpointId: props.options.endpointId,
                    },
                    database: this.app.getDatabase()
                }
            );

            this.cronManager.addInterval(props.name, intervalRef);
        }
    }

    public deleteInterval(name: string): void {
        this.cronManager.deleteInterval(name);
    }

    clearIntervals(): void {
        Array.from(this.cronManager.getIntervals()).forEach((key) =>
            this.cronManager.deleteInterval(key),
        );
    }
}