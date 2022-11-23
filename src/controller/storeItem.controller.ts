import logger from "../util/logger.js";
import express from "express";
import database from "../config/mysql.config.js";
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
  database.query(
    QUERY.STORE.GET_ITEMS,
    storeName,
    (error: any, results: any) => {
      if (!results) {
        logger.error(error.message);
        res.send(new OK("No Items Found"));
      } else {
        res.send(new OK(results , "items retrieved"));
      }
    }
  );
};

export const updateItemsFromStore = (
  req: express.Request,
  res: express.Response,
  storeName: string,
  itemId: string
) => {
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
          [
            storeName,
            req.body.itemName,
            req.body.itemQuantity,
            req.body.itemNotes,
            req.body.url,
            itemId,
          ],
          (error: any, results: any, fields: any) => {
            if (!error) {
              console.log(results);
              //get the active item count
              database.query(
                QUERY.STORE.GET_COUNT,
                storeName,
                (error: any, results: any) => {
                  if (!error) {
                    const count = results[0].activeItemsCount;
                    database.query(
                      //update the master
                      QUERY.MASTER.UPDATE_STORE,
                      ["master", count, req.body.storeId],
                      (error: any, results: any) => {
                        if (!error) {
                          res.send(new OK("item updated"));
                        } else {
                          logger.info(error);
                        }
                      }
                    );
                  }
                }
              );
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
  const storeId = req.body.storeId;
  logger.info(`${req.method} ${req.originalUrl}, Deleting Item from Store`);
  database.query(
    QUERY.STORE.DELETE_ITEMS,
    [storeName, itemId],
    (error: any, results: any) => {
      if (results.affectedRows > 0) {
        database.query(
          QUERY.STORE.GET_COUNT,
          storeName,
          (error: any, results: any) => {
            if (!error) {
              const count = results[0].activeItemsCount;
              database.query(
                QUERY.MASTER.UPDATE_STORE,
                ["master", count, storeId],
                (err: any, result: any) => {
                  if (!error) {
                    res.send(new OK("item deleted"));
                  } else {
                    logger.info(error);
                  }
                }
              );
            } else {
              logger.info(error, "after getting count");
            }
          }
        );
      } else {
        logger.info(error, "after deleting items");
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
  //extract the data
  const { itemName, itemQuantity, itemNotes, imageUrl, storeId } = req.body;
  logger.info(`${req.method} ${req.originalUrl} Adding item(s) to store`);
  //add Items to store
  database.query(
    QUERY.STORE.ADD_ITEMS,
    [storeName, itemName, itemQuantity, itemNotes, imageUrl],
    (error: Error, results: any) => {
      if (!results) {
        logger.error(error.message, "error after adding ");
        res.send(new INTERNAL_SERVER_ERROR("unable to add item"));
      } else {
        //if successful get the count of the active items and update the master
        // console.log(results.insertId,'id');
        database.query(
          QUERY.STORE.GET_COUNT,
          storeName,
          (error: any, results: any) => {
            if (!error) {
              const count = results[0].activeItemsCount;
              database.query(
                QUERY.MASTER.UPDATE_STORE,
                ["master", count, storeId],
                (error: any, results: any) => {
                  if (!error) {
                    res.send(new OK("added item and updated count"));
                  } else {
                    logger.info(error, "after updated master");
                  }
                }
              );
            } else {
              logger.info(error, "after getting the count");
            }
          }
        );
      }
    }
  );
};
