const {createConnection} = require("typeorm");
const fs = require('fs');
const path = require('fs');

module.exports = async function() {
    const connection = await createConnection({
        name: 'app',
        type: "mysql",
        port: 3306,
        username: 'root',
        password: '',
        host: 'localhost',
        database: "app",
    });
    const databaseName = `app_test_db`;

    await connection.query(`DROP DATABASE IF EXISTS ${databaseName}`);
    await connection.query(`CREATE DATABASE ${databaseName}`);

    const templateDBConnection = await createConnection({
        type: "mysql",
        port: 3306,
        username: 'root',
        password: '',
        host: 'localhost',
        database: "app_test_db",
        migrations: ['dist/database/migrations/*.js'],// todo
    });

    await templateDBConnection.runMigrations();

    await templateDBConnection.close();
    await connection.close();
}