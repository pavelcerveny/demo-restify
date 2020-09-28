const {createConnection} = require("typeorm");

module.exports = async function() {
    const connection = await createConnection({
        type: "mysql",
        port: 3306,
        username: 'root',
        password: '',
        host: 'localhost',
        database: "app",
    });

    const databaseName = `app_test_db`;
    await connection.query(`DROP DATABASE IF EXISTS ${databaseName}`);
}
