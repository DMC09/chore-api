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
import { ParsedQs } from "qs";

export const getItemsFromStore = (req: any, res: any) => {
  logger.info(`${req.method} ${req.originalUrl} fetching all items`);
  //Query the Database
  database.query(
    QUERY.SELECT_ITEMS_FROM_STORE,
    "general_store",
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

export const updateItemsFromStore = (req: any, res: any) => {
  console.log(req.body, "body");
  logger.info(`${req.method} ${req.originalUrl} fetching all items`);

  //check for row matching the id in the DB
  database.query(
    QUERY.SELECT_ITEM_FROM_STORE,
    ["general_store", req.params.id],
    (error: any, results: any, fields: any) => {
      if (!results[0]) {
        logger.info(error);
        res.send(new NOT_FOUND(`No record found with id:${req.params.id}`));
      } else {
        //Perform update to record 
        logger.info(`${req.method} ${req.originalUrl}, updating store`);
        database.query(
          QUERY.UPDATE_ITEMS_FROM_STORE,
          ["general_store", ...Object.values(req.body), req.params.id],
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
