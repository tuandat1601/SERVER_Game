/*
  Warnings:

  - A unique constraint covering the columns `[guildid]` on the table `Guild` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Guild_guildid_key` ON `Guild`(`guildid`);
