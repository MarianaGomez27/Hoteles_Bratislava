import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1649060991546 implements MigrationInterface {
  name = 'CreateDatabase1649060991546';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."onboarding_status_enum" AS ENUM('IN_PROGRESS', 'FINISHED', 'ABANDONED', 'IN_REVIEW')`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('ADMIN', 'SUPPORT', 'OPERATIONS', 'AGENCY_ADMIN', 'AGENCY_USER', 'ENTERPRISE_ADMIN', 'ENTERPRISE_USER', 'USER')`,
    );

    await queryRunner.query(
      `CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "externalId" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "firstName" character varying,
        "fathersLastName" character varying,
        "mothersLastName" character varying,
        "email" character varying NOT NULL,
        "mobilePhoneNumber" character varying,
        "phoneNumber" character varying,
        "dateOfBirth" date,
        "countryOfBirth" character varying,
        "state" character varying,
        "townOrCity" character varying,
        "suburb" character varying,
        "street" character varying,
        "buildingNumber" character varying,
        "internalBuildingNumber" character varying,
        "postcode" character varying,
        "agencyName" character varying,
        "rnt" character varying,
        "rntFileName" character varying,
        "taxIdentificationNumber" character varying,
        "taxIdentificationNumberFileName" character varying,
        "clabe" character varying,
        "clabeFileName" character varying,
        "companyName" character varying,
        "isAmavAffiliate" character varying,
        "onboardingStatus" "public"."onboarding_status_enum",
        "role" "public"."user_role_enum",
        CONSTRAINT "PK_cace4a159ff9f2512dd42373769" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."place_type_enum" AS ENUM('HOTEL', 'AIRBNB', 'TIMESHARE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "places" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying, "checkInTime" integer, "checkOutTime" integer, "maxGuests" integer, "maxPets" integer, "placeType" "public"."place_type_enum" NOT NULL DEFAULT 'HOTEL', "address" character varying, "photos" text, "description" character varying, "perks" character varying, "price" character varying, "currency" character varying, "extraInfo" character varying, CONSTRAINT "PK_1209d107fe21482beaea51b7459" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "placeId" uuid NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "checkInDate" TIMESTAMP NOT NULL, "checkOutDate" TIMESTAMP NOT NULL, "bookingContactName" character varying, "bookingContactPhoneNumber" character varying, "bookingNotes" character varying, "price" character varying, "currency" character varying, "numberOfAdults" integer, "numberOfChildren" integer, "numberOfPets" integer, CONSTRAINT "PK_1209d107fe21482beaea51b746e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type_enum" AS ENUM('CASH')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_direction_enum" AS ENUM('DEPOSIT', 'WITHDRAW')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "type" "public"."transaction_type_enum" NOT NULL, "direction" "public"."transaction_direction_enum" NOT NULL, "placeId" uuid, "paymentReference" character varying, "quantity" integer NOT NULL, "externalId" integer, "orderId" uuid NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_currency_enum" AS ENUM('USD')`,
    );

    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "placeId" uuid NOT NULL, "userId" uuid NOT NULL, "bankAccountId" character varying NOT NULL, "externalRoundId" integer NOT NULL, "externalCreatedAt" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "currency" "public"."order_currency_enum" NOT NULL DEFAULT 'USD', "amount" integer NOT NULL, "quantity" integer NOT NULL, "deadline" character varying NOT NULL, "paymentReference" character varying NOT NULL, "transferConfirmed" boolean, CONSTRAINT "PK_1031171c13130102495201e3e29" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "waitlist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "userId" character varying, CONSTRAINT "PK_973cfbedc6381485681d6a69169" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_8300048608d8721aea27747b128" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_8300048608d8721aea27747b129" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea38" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_5a4563ae1b6c03c140e5ec17a68" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_a6e45c89cfbe8d92840266fd308" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b88" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_a6e45c89cfbe8d92840266fd309"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_5a4563ae1b6c03c140e5ec17a69"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea39"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8878887f57d954892634dee5a8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a4b7617c266eb1c40ca4214b1c"`,
    );
    await queryRunner.query(`DROP TABLE "waitlist"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TYPE "public"."order_currency_enum"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_direction_enum"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0ef16b3a5759e3509ebe0746f8"`,
    );
    await queryRunner.query(`DROP TABLE "declaration"`);
    await queryRunner.query(`DROP TABLE "place"`);
    await queryRunner.query(`DROP TYPE "public"."place_type_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
