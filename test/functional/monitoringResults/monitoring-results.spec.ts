import * as request2 from "supertest";
import App from "../../../src/core/server";

describe('Monitoring results test', () => {

    let app: App = null;
    let request = null;

    beforeAll(async () => {
        app = new App();
        await app.run();

        request = request2(app.getServer());
    });

    it('should get not found without name parameter', async (done) => {
        const res = await request
            .get('/monitoring-results')
            .set('x-api-key', '93f39e2f-80de-4033-99ee-249d92736a25');
        expect(res.status).toBe(404);
        done();
    });

    it('should get monitoring results', async (done) => {
        const res = await request
            .get('/monitoring-results/test')
            .set('x-api-key', '93f39e2f-80de-4033-99ee-249d92736a25');
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            "success": true,
            "data": []
        });
        done();
    });


    afterAll(() => {
        app.stop();
    })
})
