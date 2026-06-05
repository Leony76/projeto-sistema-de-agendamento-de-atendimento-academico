/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `history` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "history" DROP COLUMN "deleted_at",
ADD COLUMN     "deleted_by_professor_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by_student_at" TIMESTAMP(3);
