/*
  Warnings:

  - A unique constraint covering the columns `[professorId,dayOfWeek,shift]` on the table `professors_availabilities` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "professors_availabilities_professorId_dayOfWeek_shift_key" ON "professors_availabilities"("professorId", "dayOfWeek", "shift");
