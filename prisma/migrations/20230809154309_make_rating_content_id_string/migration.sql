-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SongRating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contentId" TEXT NOT NULL,
    "vote" INTEGER NOT NULL,
    "voter" TEXT NOT NULL
);
INSERT INTO "new_SongRating" ("contentId", "id", "vote", "voter") SELECT "contentId", "id", "vote", "voter" FROM "SongRating";
DROP TABLE "SongRating";
ALTER TABLE "new_SongRating" RENAME TO "SongRating";
CREATE INDEX "contentId_index" ON "SongRating"("contentId");
CREATE UNIQUE INDEX "SongRating_contentId_voter_key" ON "SongRating"("contentId", "voter");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
