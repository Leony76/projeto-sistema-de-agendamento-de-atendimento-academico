/*
  Warnings:

  - You are about to drop the column `historico` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `appointments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ra]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `student_id` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ra` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_studentId_fkey";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "historico",
DROP COLUMN "studentId",
ADD COLUMN     "student_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "ra" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "histories" (
    "id" SERIAL NOT NULL,
    "notes" TEXT NOT NULL,
    "appointment_id" INTEGER NOT NULL,

    CONSTRAINT "histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "histories_appointment_id_key" ON "histories"("appointment_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_ra_key" ON "users"("ra");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "histories" ADD CONSTRAINT "histories_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
