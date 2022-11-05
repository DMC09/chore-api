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
    const {tableName,createdAt,url} = req.body
    logger.info(`${req.method} ${req.originalUrl} creating new store`);
    database.query(QUERY.STORE.CREATE,tableName,(error:Error,results:any)=>{
        if(!error){
            console.log(results)
            database.query(QUERY.MASTER.CREATE_STORE,["master",tableName,createdAt,url],(error:Error,results:any)=>{
                if(!error){
                    console.log(results)
                    res.send(new OK('Store has been created'))
                } else {
                    logger.info(error)
                    res.send(new INTERNAL_SERVER_ERROR('unable to add store to database'))
                }
            })
        } else{
            logger.info(error)
        }
    })
}
export const deleteStore = (req: express.Request, res: express.Response) => {
    console.log(req.body)
    logger.info(`${req.method} ${req.originalUrl} deleting store`);
    database.query(QUERY.STORE.DELETE,...Object.values(req.body),(error:Error,results:any) => {
        console.log(results,'these are the results')
        if(!error) {
            res.send(new OK('store has been removed from database'))
            // database.query(QUERY.DELETE_STORE_FROM_MASTER,'stores_master',...Object.values(req.))
        } else{
            logger.info(error)
            res.send(new INTERNAL_SERVER_ERROR('unable to remove store from database'))
        }
    })

    // res.send(...Object.values(req.body))
}