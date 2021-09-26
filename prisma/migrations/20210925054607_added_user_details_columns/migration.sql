/*
  Warnings:

  - A unique constraint covering the columns `[mobileNo]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `dateOfBirth` DATE,
    ADD COLUMN `gender` VARCHAR(10),
    ADD COLUMN `mobileNo` BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX `User_mobileNo_key` ON `User`(`mobileNo`);
