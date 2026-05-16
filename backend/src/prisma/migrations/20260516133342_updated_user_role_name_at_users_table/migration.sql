/*
  Warnings:

  - You are about to drop the column `user_role` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "user_role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'STUDENT';
