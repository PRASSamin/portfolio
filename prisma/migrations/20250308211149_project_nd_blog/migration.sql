-- AlterTable
ALTER TABLE "Blog" ALTER COLUMN "thumbnail" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "content" TEXT;
