/*
  Warnings:

  - Made the column `imageUrl` on table `Topic` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subtopicId` on table `Video` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_subtopicId_fkey";

-- AlterTable
ALTER TABLE "Topic" ALTER COLUMN "imageUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "subtopicId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
