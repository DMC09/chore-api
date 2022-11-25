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

export const getItemsFromStore = (
  req: Request,
  res: Response,
  storeName: string
) => {
  logger.info(`${req.method} ${req.originalUrl} fetching all items`);
  //Query the Database
};

export const updateItemsFromStore = (
  req: express.Request,
  res: express.Response,
  storeName: string,
  itemId: string
) => {
  logger.info(`${req.method} ${req.originalUrl} fetching all items`);
  //check for row matching the id in the DB
};

export const deleteItemsFromStore = (
  req: express.Request,
  res: express.Response,
  storeName: string,
  itemId: string
) => {
  const storeId = req.body.storeId;
  logger.info(`${req.method} ${req.originalUrl}, Deleting Item from Store`);

};

export const addItemsToStore = (
  req: express.Request,
  res: express.Response,
  storeName: string
) => {
  //extract the data
  const { itemName, itemQuantity, itemNotes, imageUrl, storeId } = req.body;
  logger.info(`${req.method} ${req.originalUrl} Adding item(s) to store`);
  //add Items to store
};
