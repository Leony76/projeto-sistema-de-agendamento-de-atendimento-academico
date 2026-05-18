/*
  Warnings:

  - Changed the type of `dayOfWeek` on the `professors_availabilities` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AvailableDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- AlterTable
ALTER TABLE "professors_availabilities" DROP COLUMN "dayOfWeek",
ADD COLUMN     "dayOfWeek" "AvailableDay" NOT NULL;

-- DropEnum
DROP TYPE "DayOfWeek";

-- CreateIndex
CREATE UNIQUE INDEX "professors_availabilities_professorId_dayOfWeek_shift_key" ON "professors_availabilities"("professorId", "dayOfWeek", "shift");
