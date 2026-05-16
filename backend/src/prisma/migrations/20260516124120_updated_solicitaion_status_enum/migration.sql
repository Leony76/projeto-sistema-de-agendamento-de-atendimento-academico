/*
  Warnings:

  - The values [CONFIRMED,UNCONFIRMED,CANCELED] on the enum `SolicitationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SolicitationStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
ALTER TABLE "public"."solicitations" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "solicitations" ALTER COLUMN "status" TYPE "SolicitationStatus_new" USING ("status"::text::"SolicitationStatus_new");
ALTER TYPE "SolicitationStatus" RENAME TO "SolicitationStatus_old";
ALTER TYPE "SolicitationStatus_new" RENAME TO "SolicitationStatus";
DROP TYPE "public"."SolicitationStatus_old";
ALTER TABLE "solicitations" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "solicitations" ALTER COLUMN "status" SET DEFAULT 'PENDING';
