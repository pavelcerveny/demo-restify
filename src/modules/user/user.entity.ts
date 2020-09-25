import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {MonitoredEndpoint} from "../monitoredEndpoint/monitored-endpoints.entity";
import {MonitoringResult} from "../monitoringResult/monitoring-results.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({
        length: 255,
        nullable: false,
    })
    email: string;

    @Column({
        length: 255,
        nullable: true,
    })
    username: string;

    @Column({
        length: 255,
        nullable: true,
    })
    access_token: string;

    @OneToMany(
        type => MonitoredEndpoint,
        monitoredEndpoints => monitoredEndpoints.user,
    )
    monitoredEndpoints: MonitoredEndpoint[];
}