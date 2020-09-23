import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Users1600889052205 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "username",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "email",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "access_token",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
            ],
        }), true);

        await queryRunner.query(` 
            INSERT INTO users (username, email, access_token)
            VALUES ('Applifting', 'info@applifting.cz', '93f39e2f-80de-4033-99ee-249d92736a25'),
                ('Batman', 'batman@example.com', 'dcb20f8a-5657-4f1b-9f7f-ce65739b359e');
        `);
    }

    async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("users", true, true);
    }

}
