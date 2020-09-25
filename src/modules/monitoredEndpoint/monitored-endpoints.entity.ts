import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {MonitoringResult} from "../monitoringResult/monitoring-results.entity";
import {User} from "../user/user.entity";
import {IsInt, IsUrl, IsString} from "class-validator";

@Entity('monitored_endpoints')
export class MonitoredEndpoint {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    @IsString()
    name: string;

    @Column()
    @IsUrl()
    url: string;

    @Column({
        type: "datetime",
    })
    created_at: Date;

    @Column({
        type: "datetime",
    })
    last_check: Date;

    @Column()
    @IsInt()
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
        user => user.monitoredEndpoints,
    )
    @JoinColumn({ name: 'user_id' })
    user: User;
}