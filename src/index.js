import express from "express";
import ip from 'ip';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from '../util/logger.js'

dotenv.config();
const PORT = process.env.SEVER_PORT
const app = express()

app.use(cors({origin: '*'}))
app.use(express.json())
app.get('/', (req, res) => {
    res.send('hello!')
})
app.listen(PORT,()=>{
    logger.info(`Server running on port ${ip.address()}:${PORT}`)
})