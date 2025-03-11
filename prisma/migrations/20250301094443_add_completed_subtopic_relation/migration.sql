-- CreateTable
CREATE TABLE "CompletedSubtopic" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "subtopicId" INTEGER NOT NULL,

    CONSTRAINT "CompletedSubtopic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompletedSubtopic_userId_subtopicId_key" ON "CompletedSubtopic"("userId", "subtopicId");

-- AddForeignKey
ALTER TABLE "CompletedSubtopic" ADD CONSTRAINT "CompletedSubtopic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedSubtopic" ADD CONSTRAINT "CompletedSubtopic_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
