import * as request2 from "supertest";
import App from "../../../src/core/server";

describe('App server Test', () => {

    let app: App = null;
    let request = null;

    beforeAll(async () => {
        app = new App();
        await app.run();

        request = request2(app.getServer());
    });

    it('should return the app health', async (done) => {
        const res = await request.get('/health-check');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('status')
        expect(res.body.status).toBe('ok');
        done();
    });

    it('should return unknown route', async (done) => {
        const res = await request.get('/test');
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('/test does not exist');
        done();
    });

    it('should not authenticate', async (done) => {
        const res = await request.get('/monitoring-results');
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
        done();
    });

    it('should get monitoring results', async (done) => {
        const res = await request
            .get('/monitoring-results')
            .set('x-api-key', '93f39e2f-80de-4033-99ee-249d92736a25');
        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
            "success": false,
            "error": {
                "property": "name",
                "err": "property is missing"
            }
        });
        done();
    });


    afterAll(() => {
        app.stop();
    })
})
