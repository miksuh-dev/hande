-- CreateTable
CREATE TABLE "RandomPlaylist" (
    "contentId" TEXT NOT NULL PRIMARY KEY,
    "count" INTEGER NOT NULL
);

INSERT INTO RandomPlaylist (contentId, count)
SELECT contentId, 0 as count
FROM Song so
WHERE so.type = 'song'
Group by contentId
