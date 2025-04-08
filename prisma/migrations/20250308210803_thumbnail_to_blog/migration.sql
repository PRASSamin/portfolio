/*
  Warnings:

  - Added the required column `thumbnail` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ChatInvite_token_key";

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "thumbnail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ChatInvite" ADD CONSTRAINT "ChatInvite_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "ChatInvite_id_key";
