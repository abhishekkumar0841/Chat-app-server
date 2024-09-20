const mongoose = require('mongoose')

const dbConnection = async()=>{
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log('MONGODB CONNECTED SUCCESSFULLY');
        const connection = mongoose.connection;
        connection.on('connection', ()=>{
            console.log('MONGODB CONNECTED SUCCESSFULLY');
        })

        connection.on('error', (error)=>{
            console.log('SOMETHING WENT WRONG WITH MONGODB');
            console.log('ERROR:', error);
        })
    } catch (error) {
        console.log('MONGODB CONNECTION FAILED!!!');
        process.exit(1)
    }
}

module.exports = dbConnection