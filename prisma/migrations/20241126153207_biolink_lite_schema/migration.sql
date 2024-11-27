/*
  Warnings:

  - A unique constraint covering the columns `[sub_directory]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Profile_sub_directory_key` ON `Profile`(`sub_directory`);
