const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI)
.then((db)=> console.log('db connected'))
.catch((err)=> {
    console.log('db connection failed', err)
    process.exit(1)
})

mongoose.connection.on('error', (err)=> console.log('mongo error : ', err))

