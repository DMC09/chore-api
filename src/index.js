import express from "express";
import ip from 'ip';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const PORT = process.env.SEVER_PORT || 3000
const app = express()

app.use(cors({origin: '*'}))
app.use(express.json())
app.get('/', (req, res) => {
    res.send('hello!')
})
app.listen(PORT,()=>{
    console.info(`Server running on port ${ip.address()}:${PORT}`)
})