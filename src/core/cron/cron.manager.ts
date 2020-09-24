import {CronJob} from "cron";

export default class CronManager {
    private readonly cronJobs = new Map<string, CronJob>();
    private readonly intervals = new Map<string, any>();

    public getCronJob(name: string): CronJob {
        const ref = this.cronJobs.get(name);
        if (!ref) {
            throw new Error(`Cron Job ${name} not found`);
        }
        return ref;
    }

    public getInterval(name: string): any {
        const ref = this.intervals.get(name);
        if (typeof ref === 'undefined') {
            throw new Error(`Interval ${name} not found`);
        }
        return ref;
    }

    addCronJob(name: string, job: CronJob): void {
        const ref = this.cronJobs.get(name);
        if (ref) {
            throw new Error(`Duplicate cron job: ${name}`);
        }
        this.cronJobs.set(name, job);
    }

    addInterval<T = any>(name: string, intervalId: T) {
        const ref = this.intervals.get(name);
        if (ref) {
            throw new Error(`Duplicate interval: ${name}`);
        }
        this.intervals.set(name, intervalId);
    }

    getCronJobs(): Map<string, CronJob> {
        return this.cronJobs;
    }

    deleteCronJob(name: string) {
        const cronJob = this.getCronJob(name);
        cronJob.stop();
        this.cronJobs.delete(name);
    }

    getIntervals(): string[] {
        return [...this.intervals.keys()];
    }

    deleteInterval(name: string) {
        const interval = this.getInterval(name);
        clearInterval(interval);
        this.intervals.delete(name);
    }


}