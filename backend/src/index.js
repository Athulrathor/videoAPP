import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

import connectDb from "./db/mongoose.js";
import app from "./app.js";

connectDb().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on PORT: ${process.env.PORT}`);
    })
}).catch((err) => {
    console.log("Error in connection failed db index.js",err)
})