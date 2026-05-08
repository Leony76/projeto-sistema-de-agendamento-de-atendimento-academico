/*
  Warnings:

  - You are about to drop the column `professorId` on the `disciplines` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "disciplines" DROP CONSTRAINT "disciplines_professorId_fkey";

-- AlterTable
ALTER TABLE "disciplines" DROP COLUMN "professorId",
ADD COLUMN     "professor_id" INTEGER;

-- AddForeignKey
ALTER TABLE "disciplines" ADD CONSTRAINT "disciplines_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professors"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
