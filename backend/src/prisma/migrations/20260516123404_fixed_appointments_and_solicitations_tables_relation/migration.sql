/*
  Warnings:

  - You are about to drop the column `roomId` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `managers` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `professors` table. All the data in the column will be lost.
  - You are about to drop the column `dateTime` on the `solicitations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[solicitation_id]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[room_id,date_time]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `managers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `professors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `room_id` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Made the column `updated_at` on table `disciplines` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `history` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `user_id` to the `managers` table without a default value. This is not possible if the table is not empty.
  - Made the column `updated_at` on table `professor_availabilities` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `user_id` to the `professors` table without a default value. This is not possible if the table is not empty.
  - Made the column `updated_at` on table `rooms` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `date_time` to the `solicitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `solicitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_id` to the `solicitations` table without a default value. This is not possible if the table is not empty.
  - Made the column `updated_at` on table `solicitations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_professor_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_roomId_fkey";

-- DropForeignKey
ALTER TABLE "disciplines" DROP CONSTRAINT "disciplines_professor_id_fkey";

-- DropForeignKey
ALTER TABLE "managers" DROP CONSTRAINT "managers_userId_fkey";

-- DropForeignKey
ALTER TABLE "professor_availabilities" DROP CONSTRAINT "professor_availabilities_professorId_fkey";

-- DropForeignKey
ALTER TABLE "professors" DROP CONSTRAINT "professors_userId_fkey";

-- DropForeignKey
ALTER TABLE "solicitations" DROP CONSTRAINT "solicitations_professor_id_fkey";

-- DropIndex
DROP INDEX "appointments_roomId_date_time_key";

-- DropIndex
DROP INDEX "managers_userId_key";

-- DropIndex
DROP INDEX "professors_userId_key";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "roomId",
ADD COLUMN     "room_id" INTEGER NOT NULL,
ADD COLUMN     "solicitation_id" INTEGER;

-- AlterTable
ALTER TABLE "disciplines" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "history" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "managers" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "professor_availabilities" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "professors" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "rooms" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "solicitations" DROP COLUMN "dateTime",
ADD COLUMN     "date_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "reason" TEXT NOT NULL,
ADD COLUMN     "room_id" INTEGER NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "appointments_solicitation_id_key" ON "appointments"("solicitation_id");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_room_id_date_time_key" ON "appointments"("room_id", "date_time");

-- CreateIndex
CREATE UNIQUE INDEX "managers_user_id_key" ON "managers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "professors_user_id_key" ON "professors"("user_id");

-- AddForeignKey
ALTER TABLE "professors" ADD CONSTRAINT "professors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "managers" ADD CONSTRAINT "managers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor_availabilities" ADD CONSTRAINT "professor_availabilities_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professors"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professors"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_solicitation_id_fkey" FOREIGN KEY ("solicitation_id") REFERENCES "solicitations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitations" ADD CONSTRAINT "solicitations_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitations" ADD CONSTRAINT "solicitations_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professors"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disciplines" ADD CONSTRAINT "disciplines_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professors"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
