import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameWaitlistToWhitelist1649934262818
  implements MigrationInterface
{
  name = 'RenameWaitlistToWhitelist1649934262818';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "waitlist" ADD CONSTRAINT "UQ_2221cffeeb64bff14201bd5b3de" UNIQUE ("email")`,
    );
    await queryRunner.query(`ALTER TABLE "waitlist" RENAME TO "whitelist"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "whitelist" RENAME TO "waitlist"`);
    await queryRunner.query(
      `ALTER TABLE "waitlist" DROP CONSTRAINT "UQ_2221cffeeb64bff14201bd5b3de"`,
    );
  }
}
