/*
  Warnings:

  - You are about to drop the column `ended` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `started` on the `Song` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "videoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "serverHash" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "startedAt" DATETIME,
    "endedAt" DATETIME,
    "skipped" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requester" TEXT NOT NULL
);
INSERT INTO "new_Song" ("createdAt", "duration", "id", "requester", "serverHash", "skipped", "startedAt", "thumbnail", "title", "videoId") SELECT "createdAt", "duration", "id", "requester", "serverHash", "skipped", "startedAt", "thumbnail", "title", "videoId" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
