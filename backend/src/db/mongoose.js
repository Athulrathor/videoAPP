import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
    try {
        
        const connectedResponse = await mongoose.connect(
          `${process.env.MONGODB_URL}/${DB_NAME}`
        );
        console.log(`Mongodb connected!!! DB_HOST: ${connectedResponse.connection.host}`);

    } catch (error) {
        console.log("Mongodb connection error mongoose.js", error);
        process.exit()
    }
};

export default connectDb;