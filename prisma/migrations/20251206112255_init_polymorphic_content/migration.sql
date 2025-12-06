/*
  Warnings:

  - Changed the type of `content` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PostContentType" AS ENUM ('QUILL_DELTA', 'MARKDOWN', 'HTML_RAW');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "contentHtml" TEXT,
ADD COLUMN     "contentType" "PostContentType" NOT NULL DEFAULT 'QUILL_DELTA',
DROP COLUMN "content",
ADD COLUMN     "content" JSONB NOT NULL;
