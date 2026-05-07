/*
  Warnings:

  - The primary key for the `professors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `professors` table. All the data in the column will be lost.
  - The primary key for the `students` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `registered_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roomId,date_time]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomId` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `disciplines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `professor_availabilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `solicitations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'UNAVAILABLE');

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_professor_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_student_id_fkey";

-- DropForeignKey
ALTER TABLE "disciplines" DROP CONSTRAINT "disciplines_professorId_fkey";

-- DropForeignKey
ALTER TABLE "professor_availabilities" DROP CONSTRAINT "professor_availabilities_professorId_fkey";

-- DropForeignKey
ALTER TABLE "solicitations" DROP CONSTRAINT "solicitations_professor_id_fkey";

-- DropForeignKey
ALTER TABLE "solicitations" DROP CONSTRAINT "solicitations_student_id_fkey";

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "roomId" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "disciplines" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "history" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "professor_availabilities" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "professors" DROP CONSTRAINT "professors_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "solicitations" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "students" DROP CONSTRAINT "students_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "deletedAt",
DROP COLUMN "registered_at",
DROP COLUMN "role",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "photo" TEXT;

-- CreateTable
CREATE TABLE "rooms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "RoomStatus" NOT NULL,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "appointments_roomId_date_time_key" ON "appointments"("roomId", "date_time");

-- AddForeignKey
ALTER TABLE "professor_availabilities" ADD CONSTRAINT "professor_availabilities_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professors"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professors"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitations" ADD CONSTRAINT "solicitations_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitations" ADD CONSTRAINT "solicitations_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professors"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disciplines" ADD CONSTRAINT "disciplines_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professors"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
