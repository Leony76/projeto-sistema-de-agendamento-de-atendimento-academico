/*
  Warnings:

  - You are about to drop the column `hasTemporaryPassword` on the `users` table. All the data in the column will be lost.
  - Made the column `solicitation_id` on table `appointments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_solicitation_id_fkey";

-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "solicitation_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "hasTemporaryPassword",
ADD COLUMN     "has_temporary_password" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_solicitation_id_fkey" FOREIGN KEY ("solicitation_id") REFERENCES "solicitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
