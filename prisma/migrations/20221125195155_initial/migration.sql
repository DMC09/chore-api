-- CreateTable
CREATE TABLE `Stores` (
    `storeId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `lastUpdated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Stores_name_key`(`name`),
    PRIMARY KEY (`storeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StoreItems` (
    `itemId` INTEGER NOT NULL AUTO_INCREMENT,
    `storeId` INTEGER NOT NULL,
    `itemName` VARCHAR(191) NOT NULL,
    `itemNotes` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `addedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`itemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
