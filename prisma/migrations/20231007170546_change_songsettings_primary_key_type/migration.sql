/*
  Warnings:

  - The primary key for the `SongSettings` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SongSettings" (
    "contentId" TEXT NOT NULL PRIMARY KEY,
    "volume" INTEGER NOT NULL DEFAULT 50
);
INSERT INTO "new_SongSettings" ("contentId", "volume") SELECT "contentId", "volume" FROM "SongSettings";
DROP TABLE "SongSettings";
ALTER TABLE "new_SongSettings" RENAME TO "SongSettings";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
