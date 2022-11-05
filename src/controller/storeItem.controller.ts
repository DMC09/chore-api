import logger from "../util/logger.js";
import express from "express";
import database from "../config/mysql.config.js";
import QUERY from "../query/stores.query.js";
import {OK,CREATED,BAD_REQUEST,NOT_FOUND,INTERNAL_SERVER_ERROR,} from "../domain/responses.js";
import { Request, Response } from "express-serve-static-core";

export const getItemsFromStore = (
  req: express.Request,
  res: express.Response,
  storeName: string
) => {
  logger.info(`${req.method} ${req.originalUrl} fetching all items`);
  //Query the Database
  database.query(
    QUERY.STORE.GET_ITEMS,
    storeName,
    (error: any, results: any) => {
      if (!results) {
        logger.error(error.message);
        res.send(new OK("No Items Found"));
      } else {
        res.send(new OK({ results }, "items retrieved"));
      }
    }
  );
};

export const updateItemsFromStore = (
  req: express.Request,
  res: express.Response,
  storeName: string,
  itemId:string
) => {
  console.log(req.body, "body");
  logger.info(`${req.method} ${req.originalUrl} fetching all items`);

  //check for row matching the id in the DB
  database.query(
    QUERY.STORE.GET_ITEM,
    [storeName, itemId],
    (error: any, results: any, fields: any) => {
      if (!results[0]) {
        logger.info(error);
        res.send(new NOT_FOUND(`No record found with id:${itemId}`));
      } else {
        //Perform update to record
        logger.info(`${req.method} ${req.originalUrl}, updating store`);
        database.query(
          QUERY.STORE.UPDATE_ITEMS,
          [storeName, ...Object.values(req.body), itemId],
          (error: any, results: any, fields: any) => {
            if (!error) {
              res.send(new OK({ ...req.body }, "item updated"));
            } else {
              logger.error(error);
              res.send(new INTERNAL_SERVER_ERROR("unable to update item"));
            }
          }
        );
      }
    }
  );
};

export const deleteItemsFromStore = (
  req: express.Request,
  res: express.Response,
  storeName: string,
  itemId: string
) => {
  logger.info(`${req.method} ${req.originalUrl}, Deleting Item from Store`);
  database.query(
    QUERY.STORE.DELETE_ITEMS,
    [storeName, itemId],
    (error: any, results: any) => {
      if (results.affectedRows > 0) {
        res.send(new OK({ results }, "item deleted"));
      } else {
        res.send(new INTERNAL_SERVER_ERROR("unable to delete item"));
      }
    }
  );
};

export const addItemsToStore = (
  req: express.Request,
  res: express.Response,
  storeName: string
) => {
  logger.info(`${req.method} ${req.originalUrl},Adding item(s) to store`);
  database.query(
    QUERY.STORE.ADD_ITEMS,
    [storeName, ...Object.values(req.body)],
    (error: Error, results: any) => {
      if (!results) {
        logger.error(error.message);
        res.send(new INTERNAL_SERVER_ERROR("unable to add item"));
      } else {
        console.log(JSON.stringify(results));
        res.send(new OK("created"));
      }
    }
  );
};
