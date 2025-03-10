import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1710000000000 implements MigrationInterface {
    name = 'CreateInitialTables1710000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying NOT NULL,
                "password" character varying NOT NULL,
                "email" character varying,
                "isAdmin" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);

        // Create stores table
        await queryRunner.query(`
            CREATE TABLE "stores" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "address" character varying,
                "phone" character varying,
                "description" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                CONSTRAINT "REL_2baff9b26d7d1f8d50e5ffe5d5" UNIQUE ("userId"),
                CONSTRAINT "PK_7aa6e7d71fa7ee4dee7c3d7a9a2" PRIMARY KEY ("id")
            )
        `);

        // Create parts table
        await queryRunner.query(`
            CREATE TABLE "parts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" character varying,
                "price" numeric(10,2) NOT NULL,
                "imageUrl" character varying,
                "isAvailable" boolean NOT NULL DEFAULT true,
                "category" character varying,
                "brand" character varying,
                "model" character varying,
                "year" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "storeId" uuid,
                CONSTRAINT "PK_3e8bfc5b9e0e474d6f0629b8f8a" PRIMARY KEY ("id")
            )
        `);

        // Add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "stores" 
            ADD CONSTRAINT "FK_2baff9b26d7d1f8d50e5ffe5d5a" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") 
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "parts" 
            ADD CONSTRAINT "FK_a7a2c2a6c7f4e866389d51c2d4a" 
            FOREIGN KEY ("storeId") REFERENCES "stores"("id") 
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        // Create extension for UUID generation if it doesn't exist
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys first
        await queryRunner.query(`ALTER TABLE "parts" DROP CONSTRAINT "FK_a7a2c2a6c7f4e866389d51c2d4a"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_2baff9b26d7d1f8d50e5ffe5d5a"`);
        
        // Drop tables
        await queryRunner.query(`DROP TABLE "parts"`);
        await queryRunner.query(`DROP TABLE "stores"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
} 