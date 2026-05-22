/*
  Warnings:

  - The values [UNCONFIRMED] on the enum `AppointmentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `solicitation_id` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the `solicitations` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AppointmentStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CONFIRMED', 'CANCELED', 'DONE', 'NO_SHOW');
ALTER TABLE "public"."appointments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "appointments" ALTER COLUMN "status" TYPE "AppointmentStatus_new" USING ("status"::text::"AppointmentStatus_new");
ALTER TYPE "AppointmentStatus" RENAME TO "AppointmentStatus_old";
ALTER TYPE "AppointmentStatus_new" RENAME TO "AppointmentStatus";
DROP TYPE "public"."AppointmentStatus_old";
ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_room_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_solicitation_id_fkey";

-- DropForeignKey
ALTER TABLE "solicitations" DROP CONSTRAINT "solicitations_professor_id_fkey";

-- DropForeignKey
ALTER TABLE "solicitations" DROP CONSTRAINT "solicitations_student_id_fkey";

-- DropIndex
DROP INDEX "appointments_solicitation_id_key";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "solicitation_id",
ALTER COLUMN "room_id" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- DropTable
DROP TABLE "solicitations";

-- DropEnum
DROP TYPE "SolicitationStatus";

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
