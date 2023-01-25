import mongoose from "mongoose";

async function dbConnect(connectionString: string) {

    try {
        mongoose.set("strictQuery", true);
        mongoose.connect(connectionString);
        console.log("Connected to the database");
    } catch (error) {
        console.log("Error while connecting to database: " + error);
    }

}


export default dbConnect;