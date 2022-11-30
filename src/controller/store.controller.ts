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

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export const getAllStores = async (
  req: express.Request,
  res: express.Response
) => {
  logger.info(`${req.method} ${req.originalUrl} getting stores`);
  const allStoresData = await prisma.stores
    .findMany({
      include:{
        storeItems:true
      }
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  res.send(new OK(allStoresData));
};

export const addStore = async (req: express.Request, res: express.Response) => {
  //extract name and url from the request body
  const { storeName, url } = req.body;

  logger.info(`${req.method} ${req.originalUrl} creating new store`);

  console.log(Date.now(), "the date");
  const currentTimeInSeconds = moment().unix();

  const storeToAdd = await prisma.stores
    .create({
      data: {
        storeName,
        lastUpdated: 0,
        createdAt: currentTimeInSeconds,
        url,
      },
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(async () => {
      await prisma.$disconnect;
    });

  res.send(new OK(storeToAdd));
};

export const deleteStore = async (
  req: express.Request,
  res: express.Response,
  storeId: number
) => {
  console.log(storeId);

  logger.info(`${req.method} ${req.originalUrl} deleting store`);

  const storeToDelete = await prisma.stores.delete({
    where: {
      storeId
    },
  });

  // res.send(...Object.values(req.body))
  res.send(new OK(storeToDelete));
};
