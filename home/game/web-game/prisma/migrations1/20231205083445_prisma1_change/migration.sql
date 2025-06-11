/*
  Warnings:

  - Added the required column `msg` to the `ChatLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chatlog` ADD COLUMN `msg` VARCHAR(191) NOT NULL,
    ADD COLUMN `sender` VARCHAR(16) NOT NULL DEFAULT '',
    ADD COLUMN `target` VARCHAR(16) NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX `ChatLog_serverid_sender_createdAt_idx` ON `ChatLog`(`serverid`, `sender`, `createdAt`);
