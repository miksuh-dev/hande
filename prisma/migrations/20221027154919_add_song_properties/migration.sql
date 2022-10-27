/*
  Warnings:

  - You are about to drop the column `duration` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Song` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
