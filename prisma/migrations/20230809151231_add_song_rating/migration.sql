-- CreateTable
CREATE TABLE "SongRating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contentId" INTEGER NOT NULL,
    "vote" INTEGER NOT NULL,
    "voter" TEXT NOT NULL,
    CONSTRAINT "SongRating_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SongRating_contentId_voter_key" ON "SongRating"("contentId", "voter");
