-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('CANCELED', 'CONFIRMED', 'UNCONFIRMED', 'DONE', 'NO_SHOW');

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "status" "AppointmentStatus" NOT NULL DEFAULT 'UNCONFIRMED';
