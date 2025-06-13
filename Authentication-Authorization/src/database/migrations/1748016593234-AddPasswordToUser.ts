import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordToUser1748016593234 implements MigrationInterface {
    name = 'AddPasswordToUser1748016593234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`password\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password\``);
    }

}
