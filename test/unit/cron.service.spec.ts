import CronService from "../../src/core/cron/cron.service";
import App from "../../src/core/server";
jest.mock("../../src/core/server");

describe('Cron service unit', () => {

    let cronService: CronService;

    beforeAll(async () => {
        cronService = new CronService(new App());
    });

    beforeEach(() => {
    })

    it('We can check if the consumer called the class constructor', () => {
        expect(App).toHaveBeenCalledTimes(1);
    });

    afterAll(() => {

    })
})
