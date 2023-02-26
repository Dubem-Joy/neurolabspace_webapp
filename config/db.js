const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        const con = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser:true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB conncected: ${con.connection.host}`.cyan.underline);
    } catch (error) {
        console.log(`Error: ${error.message}`.red.bold);
        process.exit();
    }
}


module.exports = connectDB;