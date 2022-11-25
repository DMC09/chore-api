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

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const getAllStores = async(req: express.Request, res: express.Response) => {
  logger.info(`${req.method} ${req.originalUrl} getting stores`);
  // const allStoresData = await prisma.stores.findMany().catch((err) => {
  //   console.error(err);
  // })
  // .finally(async () => {
  //   await prisma.$disconnect();
  // });

  console.log(Date.now(),'the date')

  const storeToAdd= await prisma.stores.create({data:{
    name: "Kroger",
    lastUpdated: 0,
    createdAt: Date.now(),
    url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTslpsKZJOtZw6v3xf7vyilLdX7bIxGh9Z4lapdkKVWA&s"
  }}).catch(err => {console.error(err);}).finally(async () => {
    await prisma.$disconnect
  })



    res.send(new OK(storeToAdd))
};

export const addStore = async (req: express.Request, res: express.Response) => {
  //extract data
  const { storeName, imageUrl } = req.body;
  

  logger.info(`${req.method} ${req.originalUrl} creating new store`);


};

export const deleteStore = (req: express.Request, res: express.Response) => {
  //extract the items
  const { storeName, storeId } = req.body;

  logger.info(`${req.method} ${req.originalUrl} deleting store`);
  //Drop the store and then delete it from the master

  // res.send(...Object.values(req.body))
};
