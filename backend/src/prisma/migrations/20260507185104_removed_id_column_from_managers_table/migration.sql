/*
  Warnings:

  - The primary key for the `managers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `managers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "managers" DROP CONSTRAINT "managers_pkey",
DROP COLUMN "id";
