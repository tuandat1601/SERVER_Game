-- DropIndex
DROP INDEX `Role_serverid_id_idx` ON `role`;

-- AlterTable
ALTER TABLE `role` ADD COLUMN `status` SMALLINT UNSIGNED NOT NULL DEFAULT 0;
