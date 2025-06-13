import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPermissionEntityandRoleRelation1749797739687 implements MigrationInterface {
    name = 'AddPermissionEntityandRoleRelation1749797739687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`permission\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, UNIQUE INDEX \`IDX_240853a0c3353c25fb12434ad3\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role_permissions_permission\` (\`roleId\` int NOT NULL, \`permissionId\` int NOT NULL, INDEX \`IDX_b36cb2e04bc353ca4ede00d87b\` (\`roleId\`), INDEX \`IDX_bfbc9e263d4cea6d7a8c9eb3ad\` (\`permissionId\`), PRIMARY KEY (\`roleId\`, \`permissionId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`role\` CHANGE \`name\` \`name\` enum ('superadmin', 'admin', 'user') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`role_permissions_permission\` ADD CONSTRAINT \`FK_b36cb2e04bc353ca4ede00d87b9\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`role_permissions_permission\` ADD CONSTRAINT \`FK_bfbc9e263d4cea6d7a8c9eb3ad2\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permission\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`role_permissions_permission\` DROP FOREIGN KEY \`FK_bfbc9e263d4cea6d7a8c9eb3ad2\``);
        await queryRunner.query(`ALTER TABLE \`role_permissions_permission\` DROP FOREIGN KEY \`FK_b36cb2e04bc353ca4ede00d87b9\``);
        await queryRunner.query(`ALTER TABLE \`role\` CHANGE \`name\` \`name\` enum ('superadmin', 'admin', 'mentor', 'user') NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_bfbc9e263d4cea6d7a8c9eb3ad\` ON \`role_permissions_permission\``);
        await queryRunner.query(`DROP INDEX \`IDX_b36cb2e04bc353ca4ede00d87b\` ON \`role_permissions_permission\``);
        await queryRunner.query(`DROP TABLE \`role_permissions_permission\``);
        await queryRunner.query(`DROP INDEX \`IDX_240853a0c3353c25fb12434ad3\` ON \`permission\``);
        await queryRunner.query(`DROP TABLE \`permission\``);
    }

}
