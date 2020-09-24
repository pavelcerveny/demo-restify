import {Connection} from "typeorm";
import {MonitoringResult} from "../../../modules/monitoringResult/monitoring-results.entity";
import {MonitoredEndpoint} from "../../../modules/monitoredEndpoint/monitored-endpoints.entity";

interface CronJobProps {
    database: Connection;
    cronJob: CronJobData
}

interface CronJobData {
    endpointId: number;
    url: string;
}

export default async function FetchJob ({cronJob, database}: CronJobProps): Promise<void> {
    const response = await fetch(cronJob.url);
    const responseBody = await response.text();

    const monitoringResult = new MonitoringResult();
    monitoringResult.checked_at = new Date();
    monitoringResult.monitoredEndpoint = await database.getRepository(MonitoredEndpoint).findOne(cronJob.endpointId);
    monitoringResult.payload = responseBody;
    monitoringResult.status_code = response.status;

    try {
        await database.getRepository(MonitoringResult).insert(monitoringResult);
    } catch (e) {
        console.log(e); // change to logger
    }

}