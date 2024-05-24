const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
    mongoose
        .connect(
            "mongodb+srv://phungtientaicualo2003:cualo25112003@cluster0.qqiwekq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        )
        .then(() => {
            console.log("Successfully connected to MongoDB Atlas!");
        })
        .catch((error) => {
            console.log("Unable to connect to MongoDB Atlas!");
            console.error(error);
        });
}

module.exports = dbConnect;
