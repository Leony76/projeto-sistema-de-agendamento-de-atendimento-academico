-- AlterTable
ALTER TABLE "disciplines" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "history" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "professor_availabilities" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "rooms" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "solicitations" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP NOT NULL;
