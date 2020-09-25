import "reflect-metadata";
import App from "./core/server";

const server = new App();
server.run();

process.on('uncaughtException', async (err) => {
    // graceful shutdown
    server.clearCronJobs();
    await server.stop();
})
