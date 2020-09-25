import {Connection} from "typeorm";
import fetch from 'node-fetch';

import {MonitoringResult} from "../../../modules/monitoringResult/monitoring-results.entity";
import {MonitoredEndpoint} from "../../../modules/monitoredEndpoint/monitored-endpoints.entity";
import App from "../../server";

interface CronJobProps {
    database: Connection;
    cronJob: CronJobData
}

interface CronJobData {
    endpointId: number;
    url: string;
}

export default async function FetchJob({cronJob, database}: CronJobProps): Promise<void> {
    const response = await fetch(cronJob.url);
    const responseBody = await response.text();
    const monitoredEndpoint: MonitoredEndpoint = await database.getRepository(MonitoredEndpoint).findOne(cronJob.endpointId);
    monitoredEndpoint.last_check = new Date();
    await database.getRepository(MonitoredEndpoint).save(monitoredEndpoint);
    
    const monitoringResult = new MonitoringResult();
    monitoringResult.checked_at = new Date();
    monitoringResult.monitoredEndpoint = monitoredEndpoint;
    monitoringResult.payload = responseBody;
    monitoringResult.status_code = response.status;

    try {
        await database.getRepository(MonitoringResult).insert(monitoringResult);
    } catch (e) {
        App.logger.error(e);
    }

}