import express from "express";
import ip from "ip";
import dotenv from "dotenv";
import cors from "cors";
import logger from "./util/logger.js";
// @ts-ignore
import httpResponse from "express-http-response";
import {OK,CREATED,BAD_REQUEST,NOT_FOUND,INTERNAL_SERVER_ERROR} from './domain/responses.js'
import {getItemsFromStore,updateItemsFromStore} from './controller/store.controller.js'

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


app.get("/general",(req, res) => {
  getItemsFromStore(req, res);
})
app.put("/general/:id",(req, res) => {
  updateItemsFromStore(req, res);
})

//initialilzer
app.listen(PORT, () => {
  // console.log(httpResponse);
  logger.info(`Server running on port ${ip.address()}:${PORT}`);
});
