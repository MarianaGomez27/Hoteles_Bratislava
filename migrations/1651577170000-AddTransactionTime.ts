import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTransactionTime1651577170185 implements MigrationInterface {
  name = 'AddTransactionTime1651577170185';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "transactionTime" TIMESTAMP NOT NULL DEFAULT '2022-01-01 01:00:00'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "transactionTime"`,
    );
  }
}
