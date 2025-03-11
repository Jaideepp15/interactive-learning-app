/*
  Warnings:

  - You are about to drop the column `topicId` on the `Video` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_topicId_fkey";

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "topicId",
ADD COLUMN     "subtopicId" INTEGER;

-- CreateTable
CREATE TABLE "Subtopic" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "topicId" INTEGER NOT NULL,

    CONSTRAINT "Subtopic_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subtopic" ADD CONSTRAINT "Subtopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
