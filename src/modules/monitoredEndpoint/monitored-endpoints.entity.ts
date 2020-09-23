import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {MonitoringResult} from "../monitoringResult/monitoring-results.entity";
import {User} from "../user/user.entity";

@Entity('monitored_endpoints')
export class MonitoredEndpoint {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string;

    @Column()
    url: string;

    @Column({
        type: "date",
    })
    created_at: Date;

    @Column({
        type: "date",
    })
    last_check: Date;

    @Column()
    monitored_interval: number;

    @OneToMany(
        type => MonitoringResult,
        monitoringResults => monitoringResults.monitoredEndpoint,
        {
            eager: true,
            cascade: ['insert', 'update', 'remove'],
        },
    )
    monitoringResults: MonitoringResult[];

    @ManyToOne(
        type => User,
        user => user.monitoringResults,
    )
    @JoinColumn({ name: 'user_id' })
    user: User;
}