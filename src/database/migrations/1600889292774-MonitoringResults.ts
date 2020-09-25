import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class MonitoringResults1600889292774 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "monitoring_results",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "checked_at",
                    type: "timestamp",
                    isNullable: false,
                },
                {
                    name: "status_code",
                    type: "integer",
                    isNullable: false,
                },
                {
                    name: "payload",
                    type: "mediumtext",
                    isNullable: false,
                },
                {
                    name: "monitored_endpoint_id",
                    type: "integer",
                    isNullable: false
                },
            ],
        }), true);

        await queryRunner.createForeignKey("monitoring_results", new TableForeignKey({
            columnNames: ["monitored_endpoint_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "monitored_endpoints",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("monitoring_results", true, true);
    }

}
