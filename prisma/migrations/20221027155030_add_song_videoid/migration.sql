/*
  Warnings:

  - Added the required column `videoId` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "videoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "serverHash" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "startedAt" DATETIME,
    "endedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Song" ("createdAt", "endedAt", "id", "serverHash", "startedAt", "thumbnail", "title") SELECT "createdAt", "endedAt", "id", "serverHash", "startedAt", "thumbnail", "title" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
CREATE UNIQUE INDEX "Song_videoId_key" ON "Song"("videoId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
