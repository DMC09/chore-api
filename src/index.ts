import express, { application } from "express";
import ip from "ip";
import dotenv from "dotenv";
import cors from "cors";
import logger from "./util/logger.js";
// @ts-ignore
import httpResponse from "express-http-response";
import {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "./domain/responses.js";
import {
  getItemsFromStore,
  updateItemsFromStore,
  deleteItemsFromStore,
  addItemsToStore,
} from "./controller/storeItem.controller.js";
import {getAllStoresAndStoreItems,addStore, deleteStore} from "./controller/store.controller.js"

//config
dotenv.config();
const PORT = process.env.SEVER_PORT;
const app = express();
//middle ware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(httpResponse.Middleware);


//generic routes
app.get("/", (req, res) => {
  res.send(new OK(process.env.NODE_ENV));
});

//env checks
app.get("/check",(req, res)=>{
  logger.info(process.env)
  res.send(new OK('logged env details'))
})


//CRD for Master Tables
app.get("/stores", (req: express.Request, res:express.Response)=>[
  getAllStoresAndStoreItems(req, res)
])
app.post("/stores", (req, res) => {
  addStore(req, res)
});
app.delete("/stores/:storeId", (req, res) => {
  deleteStore(req, res, +req.params.storeId)
});

//
app.get("/stores/:storeId/items", (req, res) => {
  getItemsFromStore(req, res, +req.params.storeId);
});
app.put("/stores/:storeId/items/:itemId", (req, res) => {
  updateItemsFromStore(req, res,+req.params.storeId,+req.params.itemId);
});
app.delete("/stores/:storeId/items/:itemId", (req, res) => {
  deleteItemsFromStore(req, res,+req.params.storeId,+req.params.itemId);
});
app.post("/stores/:storeId/items", (req, res) => {
  addItemsToStore(req, res, +req.params.storeId);
});





app.all('/*', (req:Request, res:any) => {
  logger.info(`${req.method} ${req.url} bad route hit! `)
  res.send(new INTERNAL_SERVER_ERROR('Route does not exist!'))})


//initializer
app.listen(PORT, () => {
logger.info(process.env.NODE_ENV)
  logger.info(`Server running on port ${ip.address()}:${PORT}`);
});
