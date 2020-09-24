import { CronJob } from 'cron';
import CronManager from "./cron.manager";

export default class CronService {

    private readonly cronManager: CronManager = new CronManager();

    public addInterval(name: string, cb: any) {

    }

    mountIntervals() {
        const intervalKeys = Object.keys(this.cronManager.getIntervals());
        intervalKeys.forEach((key) => {
            const options = this.cronManager.getInterval(key);
            const intervalRef = setInterval(options.target, options.timeout);

            options.ref = intervalRef;
            this.cronManager.addInterval(key, intervalRef);
        });
    }

    mountCron() {
        const cronKeys = Object.keys(this.cronManager.getCronJobs());
        cronKeys.forEach((key) => {
            const { options, target } = this.cronManager.getCronJob(key);
            const cronJob = new CronJob(
                options.cronTime,
                target as any,
                undefined,
                false,
                options.timeZone,
                undefined,
                false,
                options.utcOffset,
                options.unrefTimeout,
            );
            cronJob.start();

            this.cronJobs[key].ref = cronJob;
            this.addCronJob(key, cronJob);
        });
    }

    clearIntervals() {
        Array.from(this.getIntervals()).forEach((key) =>
            this.deleteInterval(key),
        );
    }

    closeCronJobs() {
        Array.from(this.getCronJobs().keys()).forEach((key) =>
            this.deleteCronJob(key),
        );
    }
}