import * as request2 from "supertest";
import App from "../../../src/core/server";
import {createConnection} from "typeorm";
import {User} from "../../../src/modules/user/user.entity";
import {MonitoredEndpoint} from "../../../src/modules/monitoredEndpoint/monitored-endpoints.entity";
import {MonitoringResult} from "../../../src/modules/monitoringResult/monitoring-results.entity";

describe('Monitored endpoints test', () => {

    let app: App = null;
    let request = null;

    beforeAll(async () => {
        app = new App();
        await app.run();

        app.databaseInstance = await createConnection({
            name: 'test',
            type: "mysql",
            port: 3306,
            username: 'root',
            password: '',
            host: 'localhost',
            database: "app_test_db",
            entities: [User, MonitoredEndpoint, MonitoringResult],
        });

        request = request2(app.getServer());
    });

    it('should create new endpoint', async (done) => {

        const res = await request
            .post('/monitored-endpoints')
            .send({
                name: 'test-endpoint',
                url: 'https://weirdorconfusing.com/',
                monitored_interval: 1000
            })
            .set('x-api-key', '93f39e2f-80de-4033-99ee-249d92736a25');
        expect(res.status).toBe(201);
        done();
    });

    afterAll(() => {
        app.stop();
    })
})
