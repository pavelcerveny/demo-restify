const path = require('path');

const dev = {
    "host": "localhost",
    "entities": [
        path.join(__dirname, '/src/modules/**/**.entity{.ts,.js}')
    ],

    "migrations": [
        "src/database/migrations/*.ts"
    ],
    "cli": {
        "migrationsDir": "src/database/migrations",
        "entitiesDir": "src/entities"
    }
};

const prod = {
    "host": "localhost",
    "entities": [
        path.join(__dirname, '/dist/modules/**/**.entity.js')
    ],

    "migrations": [
        __dirname + "./src/database/migrations/*.{js,ts}"
    ],
    "cli": {
        "migrationsDir": __dirname + "./src/database/migrations/*.{js,ts}",
        "entitiesDir": __dirname + "./dist/modules/**/*.entity.{js,ts}"
    }
};

const config = process.env.NODE_ENV === 'production'
    ? prod
    : dev;

module.exports = {
    "type": "mysql",
    "port": 3306,
    "username": "root",
    "password": "",
    "database": "app",
    "synchronize": false,
    "logging": true,
    ...config
};