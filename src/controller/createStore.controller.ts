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


export const createStore = (req: express.Request, res: express.Response) => {
    logger.info(`${req.method} ${req.originalUrl} creating new store`);
    database.query(QUERY.CREATE_STORE,...Object.values(req.body),(error:Error,results:any)=>{
        if(!error){
            res.send(new OK('Store has been created'))
        } else{
            logger.info(error)
            res.send(new INTERNAL_SERVER_ERROR('unableto add store to database'))
        }
    })
}
export const deleteStore = (req: express.Request, res: express.Response) => {
    logger.info(`${req.method} ${req.originalUrl} deleting store`);
    database.query(QUERY.DELETE_STORE,...Object.values(req.body),(error:Error,results:any) => {
        if(!error) {
            res.send(new OK('store has been removed from database'))
        } else{
            logger.info(error)
            res.send(new INTERNAL_SERVER_ERROR('unable to remove store from database'))
        }
    })

    // res.send(...Object.values(req.body))
}