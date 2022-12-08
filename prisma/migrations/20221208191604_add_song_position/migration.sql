-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "videoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "started" BOOLEAN NOT NULL DEFAULT false,
    "ended" BOOLEAN NOT NULL DEFAULT false,
    "skipped" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requester" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Song" ("createdAt", "ended", "id", "requester", "skipped", "started", "thumbnail", "title", "videoId") SELECT "createdAt", "ended", "id", "requester", "skipped", "started", "thumbnail", "title", "videoId" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
