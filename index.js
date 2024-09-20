const express = require('express')
const cors = require('cors');
const dbConnection = require('./config/dbConnection');
const router = require('./routes');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const {app, server} = require('./socket/index')

// const app = express()
const PORT = process.env.PORT || 5001

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))

app.get('/', (req, res)=>{
    res.json({
        message: "Home route working fine"
    })
})

app.use('/api/v1', router)

// app.listen(PORT, async()=>{
//     await dbConnection();
//     console.log(`SERVER IS RUNNING ON http://localhost:${PORT}`);
// })

server.listen(PORT, async()=>{
    await dbConnection();
    console.log(`SERVER IS RUNNING ON http://localhost:${PORT}`);
})