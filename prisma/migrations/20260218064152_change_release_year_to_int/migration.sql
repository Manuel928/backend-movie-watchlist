/*
  Warnings:

  - A unique constraint covering the columns `[userId,movieId]` on the table `WatchListItem` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `releaseYear` on the `Movie` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "releaseYear" TYPE INTEGER USING ("releaseYear"::integer);

-- CreateIndex
CREATE UNIQUE INDEX "WatchListItem_userId_movieId_key" ON "WatchListItem"("userId", "movieId");
