const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

//middleware
dotenv.config({path: './config/config.env'})
require('./config/Db')
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use('/api/v1', require('./routes/auth'))
app.use('/api/v1', require('./routes/product'))

PORT = process.env.PORT || 5000
app.listen(PORT, console.log("app is running on port: ", PORT))