export default class CronManager {
    private readonly intervals = new Map<string, any>();

    public getInterval(name: string): any {
        const ref = this.intervals.get(name);
        if (typeof ref === 'undefined') {
            return false;
        }
        return ref;
    }

    public addInterval<T = any>(name: string, intervalId: T) {
        const ref = this.intervals.get(name);
        if (ref) {
            throw new Error(`Duplicate interval: ${name}`);
        }
        this.intervals.set(name, intervalId);
    }

    public getIntervals(): string[] {
        return [...this.intervals.keys()];
    }

    public deleteInterval(name: string) {
        const interval = this.getInterval(name);
        clearInterval(interval);
        this.intervals.delete(name);
    }


}