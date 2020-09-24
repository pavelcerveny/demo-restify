import "reflect-metadata";
import App from "./core/server";

const server = new App();
server.run();

process.on('uncaughtException', async function(err) {
    // graceful shutdown
    await server.stop();

})
