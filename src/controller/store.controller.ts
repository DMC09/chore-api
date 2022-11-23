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


export const getAllStores = (req: express.Request, res: express.Response) =>{
  logger.info(`${req.method} ${req.originalUrl} getting stores`);
  database.query(QUERY.MASTER.GET_STORES,["master"],(error: any,results: any) =>{
    if(!error){
      logger.info(error);
      res.send(new OK( results , "stores retrieved"));
    } else{
      res.send(new OK("No stores found"));
    }
  })
}

export const createStore = (req: express.Request, res: express.Response) => {
  //extract data
  const { storeName, imageUrl } = req.body;

  logger.info(`${req.method} ${req.originalUrl} creating new store`);

  //create the store and if successful create an entry for in the master
  database.query(
    QUERY.STORE.CREATE,
    storeName,
    (error: Error, results: any) => {
      if (!error) {
        database.query(
          QUERY.MASTER.CREATE_STORE,
          ["master", storeName, imageUrl],
          (error: Error, results: any) => {
            if (!error) {
              res.send(new OK("Store has been created"));
            } else {
              logger.info(error);
              res.send(
                new INTERNAL_SERVER_ERROR("unable to add store to database")
              );
            }
          }
        );
      } else {
        logger.info(error);
      }
    }
  );
};

export const deleteStore = (req: express.Request, res: express.Response) => {
//extract the items
  const {storeName,storeId} = req.body

  logger.info(`${req.method} ${req.originalUrl} deleting store`);
  //Drop the store and then delete it from the master
  database.query(
    QUERY.STORE.DELETE,
    storeName,
    (error: Error, results: any) => {
      if (!error) {
          database.query(QUERY.MASTER.DELETE_STORE,["master",storeId],(error: Error, results: any) => {
              if(!error) {
                  res.send(new OK("store has been removed from database"));
            } else {
                logger.info(error);
                res.send(
                  new INTERNAL_SERVER_ERROR("unable to remove store from database")
                );
            }
        })
      } else {
        logger.info(error);
        res.send(
          new INTERNAL_SERVER_ERROR("unable to remove store from database")
        );
      }
    }
  );

  // res.send(...Object.values(req.body))
};
