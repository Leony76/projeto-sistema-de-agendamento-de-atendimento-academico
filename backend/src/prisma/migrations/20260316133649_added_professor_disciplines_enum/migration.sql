-- CreateEnum
CREATE TYPE "ProfessorDiscipline" AS ENUM ('PORTUGUESE', 'MATH', 'GEOGRAPHY', 'HISTORY', 'BIOLOGY', 'LITERATURE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "discipline" "ProfessorDiscipline";
