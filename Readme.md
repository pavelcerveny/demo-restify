# Demo - restify

Multi health check service - manage monitored endpoints and see fetched results
- crud endpoints -> monitored-endpoints
- see results -> /monitoring-results/:endpoint-name


## Run

### Production

Create MySQL database "app" and run migrations:

```
npm run migration-dev:prod
```

Build the app using:
```
npm run build
```

And start
```
npm run start:prod
```

### Development

Create MySQL database "app" and run migrations:

```
npm run migration-dev:run
```

And start dev server
```
npm run start:dev
```

## Docker and Docker compose

Once you have Docker and Docker Compose installed, you can get this environment up and running with:

```
docker-compose build
docker-compose up -d
```

## Test

for db testing the application needs to be built (see above)

```
npm run jest
```