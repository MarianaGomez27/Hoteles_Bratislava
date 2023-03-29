import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateEventsTable1649939401682 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "rawData" text NOT NULL, "eventType" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373761" PRIMARY KEY ("id"))`,
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "event"`);
    }
}
