/*
  Warnings:

  - You are about to drop the column `room_id` on the `solicitations` table. All the data in the column will be lost.
  - You are about to drop the column `temporaryPassword` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "solicitations" DROP CONSTRAINT "solicitations_room_id_fkey";

-- AlterTable
ALTER TABLE "solicitations" DROP COLUMN "room_id";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "temporaryPassword",
ADD COLUMN     "hasTemporaryPassword" BOOLEAN NOT NULL DEFAULT false;
