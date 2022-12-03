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

export const getAllStoresAndStoreItems = async (
  req: express.Request,
  res: express.Response
) => {
  logger.info(`${req.method} ${req.originalUrl} getting stores`);
  const allStoresData = await prisma.stores
    .findMany({
      include: {
        storeItems: true,
      },
    })
    .catch(async (err) => {
      console.error(err);
      await Promise.reject(err);
      await res.send(new BAD_REQUEST(err))
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  res.send(new OK(allStoresData));
};

export const addStore = async (req: express.Request, res: express.Response) => {
  //extract name and url from the request body
  const { storeName, imageUrl } = req.body;

  logger.info(`${req.method} ${req.originalUrl} creating new store`);
  const currentTimeInSeconds = moment().unix();
  // Add store to DB
  const storeToAdd = await prisma.stores
    .create({
      data: {
        storeName,
        lastUpdated: 0,
        createdAt: currentTimeInSeconds,
        imageUrl,
      },
    })
    .catch((err) => {
      Promise.reject(err);
      console.error(err);
      res.send(new BAD_REQUEST(err));
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
  logger.info(`${req.method} ${req.originalUrl} deleting store`);


  //check if store exists
  await prisma.stores
    .findFirstOrThrow({
      where: { storeId },
    })
    .catch((err) => {
      res.send(new NOT_FOUND(err.message));
    })
    .then(async () => {
      await prisma.$disconnect();
    });

    //
  const storeToDelete = await prisma.stores.delete({
    where: {
      storeId,
    },
  });

  res.send(new OK(storeToDelete));
};
