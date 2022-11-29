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
  //Query the Database
  const itemsFromStore = await prisma.storeItems.findMany({
    where: {
      storeId,
    },
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
  //check for row matching the id in the DB




  const itemsToUpdate = await prisma.storeItems.updateMany({
    where: {
      storeId
    },
    data: {
      // data to update
    },
  })
  

  res.send(new OK("Items updated"))
};

export const deleteItemsFromStore = async (
  req: express.Request,
  res: express.Response,
  storeId: number,
  itemId:number
) => {
  logger.info(`${req.method} ${req.originalUrl}, Deleting Item from Store`);
  const itemsToDelete = await prisma.storeItems.deleteMany({
    where: {
      storeId,
      itemId
    },
  });

  res.send(new OK(itemsToDelete,"Items have been deleted"))
};

export const addItemsToStore = async (
  req: express.Request,
  res: express.Response,
  storeId: number
) => {
  //extract the data
  const { itemName, itemNotes, quantity, url } = req.body;
  const currentTimeInSeconds = moment().unix();
  logger.info(`${req.method} ${req.originalUrl} Adding item(s) to store`);
  //add Items to store

  const itemToAdd = await prisma.storeItems.create({
    data: {
      storeId,
      itemName,
      itemNotes,
      quantity,
      addedAt: currentTimeInSeconds,
    },
  });

  res.send(new OK(itemToAdd, "Item Added"));
};
