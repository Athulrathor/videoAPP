import mongoose from "mongoose";
import { getMongoUri } from "../config/env.js";

const connectDb = async () => {
    try {
        
        const connectedResponse = await mongoose.connect(
          getMongoUri()
        );
        console.log(`Mongodb connected!!! DB_HOST: ${connectedResponse.connection.host}`);

    } catch (error) {
        console.log("Mongodb connection error mongoose.js", error);
        process.exit()
    }
};

export default connectDb;
