/*
  Warnings:

  - Added the required column `startedAt` to the `Song` table without a default value. This is not possible if the table is not empty.

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
    "startedAt" DATETIME NOT NULL,
    "started" BOOLEAN NOT NULL DEFAULT false,
    "ended" BOOLEAN NOT NULL DEFAULT false,
    "skipped" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requester" TEXT NOT NULL
);
INSERT INTO "new_Song" ("createdAt", "duration", "ended", "id", "requester", "serverHash", "skipped", "started", "thumbnail", "title", "videoId") SELECT "createdAt", "duration", "ended", "id", "requester", "serverHash", "skipped", "started", "thumbnail", "title", "videoId" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
