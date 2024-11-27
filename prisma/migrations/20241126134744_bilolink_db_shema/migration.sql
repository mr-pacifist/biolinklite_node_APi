/*
  Warnings:

  - You are about to drop the column `coverUrl` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrl` on the `profile` table. All the data in the column will be lost.
  - You are about to alter the column `themeId` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `theme` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `theme` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `bio` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverPhoto` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePhoto` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub_directory` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socialMediaSubdirectory` to the `ProfileSocialMediaLink` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `Profile_themeId_fkey`;

-- AlterTable
ALTER TABLE `profile` DROP COLUMN `coverUrl`,
    DROP COLUMN `link`,
    DROP COLUMN `photoUrl`,
    ADD COLUMN `bio` VARCHAR(191) NOT NULL,
    ADD COLUMN `coverPhoto` VARCHAR(191) NOT NULL,
    ADD COLUMN `profilePhoto` VARCHAR(191) NOT NULL,
    ADD COLUMN `sub_directory` VARCHAR(191) NOT NULL,
    MODIFY `themeId` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `profilesocialmedialink` ADD COLUMN `socialMediaSubdirectory` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `theme` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_themeId_fkey` FOREIGN KEY (`themeId`) REFERENCES `Theme`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
