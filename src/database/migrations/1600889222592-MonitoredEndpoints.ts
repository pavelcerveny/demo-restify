import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class MonitoredEndpoints1600889222592 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "monitored_endpoints",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "url",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "NOW()"
                },
                {
                    name: "last_check",
                    type: "datetime",
                    isNullable: true
                },
                {
                    name: "monitored_interval",
                    type: "integer",
                    isNullable: false,
                },
                {
                    name: "user_id",
                    type: "integer",
                    isNullable: false
                },
            ],
        }), true);

        await queryRunner.createForeignKey("monitored_endpoints", new TableForeignKey({
            columnNames: ["user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("monitored_endpoints", true, true);
    }

}
