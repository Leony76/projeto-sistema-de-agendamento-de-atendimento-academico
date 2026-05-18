/*
  Warnings:

  - You are about to drop the `professor_availabilities` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Shift" AS ENUM ('MORNING', 'AFTERNOON');

-- DropForeignKey
ALTER TABLE "professor_availabilities" DROP CONSTRAINT "professor_availabilities_professorId_fkey";

-- DropTable
DROP TABLE "professor_availabilities";

-- CreateTable
CREATE TABLE "professors_availabilities" (
    "id" SERIAL NOT NULL,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "startTime" INTEGER NOT NULL,
    "endTime" INTEGER NOT NULL,
    "shift" "Shift" NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "professorId" INTEGER NOT NULL,

    CONSTRAINT "professors_availabilities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "professors_availabilities" ADD CONSTRAINT "professors_availabilities_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professors"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
