import CronService from "../../src/core/cron/cron.service";
import App from "../../src/core/server";
jest.mock("../../src/core/cron/jobs/fetch.job");
jest.mock("../../src/core/server");

describe('Cron service unit', () => {

    let cronService: CronService;

    beforeAll(async () => {
        cronService = new CronService(new App());
    });

    it('should check jest mock', () => {
        expect(App).toHaveBeenCalledTimes(1);
    });

    it('should test add interval', () => {
        const interval = {
            name: 'testJob',
            cbName: 'fetch',
            options: {
                url: 'test',
                timeout: 10,
                endpointId: 1
            }
        };
       cronService.addInterval(interval);
       expect(cronService.getIntervals().length).toBe(1)
    });

    it('should test get interval', () => {
        const interval = {
            name: 'testJob',
            cbName: 'fetch',
            options: {
                url: 'test',
                timeout: 10,
                endpointId: 1
            }
        };
        cronService.addInterval(interval);
        const returnedInterval = cronService.getInterval('testJob');
        expect(returnedInterval).not.toBe(false);
    });

    it('should delete interval', () => {
        const interval = {
            name: 'testJob',
            cbName: 'fetch',
            options: {
                url: 'test',
                timeout: 10,
                endpointId: 1
            }
        };
        cronService.addInterval(interval);
        cronService.deleteInterval('testJob');
        const returnedInterval = cronService.getInterval('testJob');
        expect(returnedInterval).toBe(false);
    });

    it('should delete all interval', () => {
        const interval = {
            name: 'testJob',
            cbName: 'fetch',
            options: {
                url: 'test',
                timeout: 10,
                endpointId: 1
            }
        };
        cronService.addInterval(interval);
        cronService.clearIntervals();
        const returnedInterval = cronService.getInterval('testJob');
        expect(returnedInterval).toBe(false);
    });

    afterAll(() => {
        cronService.clearIntervals();
    })
})
