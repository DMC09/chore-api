import express from "express";
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
} from "./controller/store.controller.js";
import {createStore, deleteStore} from "./controller/createStore.controller.js"

//config
dotenv.config();
const PORT = process.env.SEVER_PORT;
const app = express();
//middle ware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(httpResponse.Middleware);

//generic test
app.get("/", (req, res) => {
  //   const OkResponse = httpResponse.OkResponse;
  //   const response = new OkResponse();
  res.send(new OK());
});

//store managment service
app.post("/stores", (req, res) => {
  createStore(req, res)
});
app.delete("/stores", (req, res) => {
  deleteStore(req, res)
});

//individual stores
app.get("/:store", (req, res) => {
  getItemsFromStore(req, res, req.params.store);
});
app.put("/:store/:id", (req, res) => {
  updateItemsFromStore(req, res, req.params.store,req.params.id);
});
app.delete("/:store/:id", (req, res) => {
  deleteItemsFromStore(req, res, req.params.store,req.params.id);
});
app.post("/:store/", (req, res) => {
  addItemsToStore(req, res, req.params.store);
});

//initializer
app.listen(PORT, () => {
  // console.log(httpResponse);
  logger.info(`Server running on port ${ip.address()}:${PORT}`);
});
