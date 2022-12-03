import logger from "../util/logger.js";
import express from "express";

import QUERY from "../query/stores.query.js";
import {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "../domain/responses.js";
import { Request, Response } from "express-serve-static-core";
import { PrismaClient } from "@prisma/client";
import moment from "moment";
import { rmSync } from "fs";

const prisma = new PrismaClient({
  log: ["warn", "error"],
});

export const getItemsFromStore = async (
  req: Request,
  res: Response,
  storeId: number
) => {
  logger.info(`${req.method} ${req.originalUrl} fetching all items`);
  //check if store exists
  await prisma.stores
    .findFirstOrThrow({
      where: { storeId },
    })
    .catch(async (err) => {
      await res.send(new NOT_FOUND("Store not found"));
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  //Query the database
  const itemsFromStore = await prisma.storeItems
    .findMany({
      where: {
        storeId,
      },
    })
    .catch((err) => {
      console.error(err);
      res.send(new BAD_REQUEST(err));
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  res.send(new OK(itemsFromStore, "Items from store"));
};

export const updateItemsFromStore = async (
  req: express.Request,
  res: express.Response,
  storeId: number,
  itemId: number
) => {
  logger.info(`${req.method} ${req.originalUrl} fetching all items`);

  const { itemName, itemQuantity, itemNotes, imageUrl } = req.body;
  const currentTimeInSeconds = moment().unix();
  // check if the store exists first
  await prisma.storeItems
    .findFirstOrThrow({
      where: { storeId, itemId },
    })
    .catch(async (err) => {
      console.log(err);
      await res.send(new NOT_FOUND(err));
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  const itemsToUpdate = await prisma.storeItems
    .updateMany({
      where: {
        storeId,
        itemId,
      },
      data: {
        itemName,
        itemNotes,
        itemQuantity,
        imageUrl,
      },
    })
    .catch(async (err) => {
      console.error(err);
      await res.send(new BAD_REQUEST(err));
    })
    .finally(async () => {
      const currentStoreQuantity = await prisma.storeItems.count({
        where: {
          storeId,
          itemQuantity: {
            gt: 0,
          },
        },
      });

      await prisma.stores
        .update({
          where: {
            storeId,
          },
          data: {
            lastUpdated: currentTimeInSeconds,
            quantity: currentStoreQuantity,
          },
        })
        .then(async () => {
          await prisma.$disconnect();
        });
    });

  res.send(new OK(itemsToUpdate, "Items updated"));
};

export const deleteItemsFromStore = async (
  req: express.Request,
  res: express.Response,
  storeId: number,
  itemId: number
) => {
  logger.info(`${req.method} ${req.originalUrl}, Deleting Item from Store`);

  const currentTimeInSeconds = moment().unix();

  await prisma.storeItems
    .findFirstOrThrow({
      where: { storeId, itemId },
    })
    .catch(async (err) => {
      console.log(err);
      await res.send(new NOT_FOUND(err));
    });

  const itemsToDelete = await prisma.storeItems
    .deleteMany({
      where: {
        storeId,
        itemId,
      },
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(async () => {
      const currentStoreQuantity = await prisma.storeItems.count({
        where: {
          storeId,
          itemQuantity: {
            gt: 0,
          },
        },
      });

      await prisma.stores.update({
        where: { storeId },
        data: {
          lastUpdated: currentTimeInSeconds,
          quantity: currentStoreQuantity,
        },
      });
    })
    .then(async () => {
      await prisma.$disconnect();
    });

  res.send(new OK(itemsToDelete, "Items have been deleted"));
};

export const addItemsToStore = async (
  req: express.Request,
  res: express.Response,
  storeId: number
) => {
  //extract the data
  const { itemName, itemNotes, itemQuantity, imageUrl } = req.body;
  const currentTimeInSeconds = moment().unix();
  logger.info(`${req.method} ${req.originalUrl} Adding item(s) to store`);
  //add Items to store

  await prisma.stores
    .findFirstOrThrow({
      where: { storeId },
    })
    .catch((err) => {
      console.log(err);
      res.send(new NOT_FOUND(err));
    });

  const itemToAdd = await prisma.storeItems
    .create({
      data: {
        storeId,
        itemName,
        itemNotes,
        itemQuantity,
        imageUrl,
        addedAt: currentTimeInSeconds,
      },
    })
    .catch((err) => {
      console.log(err);
      res.send(new BAD_REQUEST(err))
    })
    .finally(async () => {
      const currentStoreQuantity = await prisma.storeItems.count({
        where: {
          storeId,
          itemQuantity: {
            gt: 0,
          },
        },
      });

      await prisma.stores.update({
        where: { storeId },
        data: {
          lastUpdated: currentTimeInSeconds,
          quantity: currentStoreQuantity,
        },
      });

    });
    res.send(new OK(itemToAdd, "Item Added"));
};
