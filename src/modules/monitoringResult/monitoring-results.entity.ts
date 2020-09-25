import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {MonitoredEndpoint} from "../monitoredEndpoint/monitored-endpoints.entity";

@Entity('monitoring_results')
export class MonitoringResult {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({
        type: "datetime",
    })
    checked_at: Date;

    @Column({
        nullable: true,
    })
    payload: string;

    @Column()
    status_code: number;

    @ManyToOne(
        type => MonitoredEndpoint,
        monitoredEndpoint => monitoredEndpoint.monitoringResults,
    )
    @JoinColumn({ name: 'monitored_endpoint_id' })
    monitoredEndpoint: MonitoredEndpoint;
}