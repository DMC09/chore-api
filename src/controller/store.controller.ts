import logger from '../util/logger.js'
import express from "express";
import database from "../config/mysql.config.js"
import QUERY from "../query/stores.query.js"
import {OK,CREATED,BAD_REQUEST,NOT_FOUND,INTERNAL_SERVER_ERROR} from '../domain/responses.js'





export const getItemsFromStore = (req: { method: any; originalUrl: any; },res: any) => {
    console.log(database,'database')
    logger.info(`${req.method} ${req.originalUrl} fetching all items` );
    database.query(QUERY.SELECT_ITEMS_FROM_STORE,(error: any,results: any)=>{
        console.log(error,'error')
        console.log(results,'results')
        if(!results){
            logger.error(error.message);
            res.send(new OK('No Items Found'))
        } else{
            res.send(new OK({results},'items retrieved'))
        }
    })

}
