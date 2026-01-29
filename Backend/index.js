import dotenv from "dotenv";
dotenv.config();
import express from "express"

import routes from "./routes.js"
import connectMongoDB from "./Config/MongoDb.js";

const app = express();
const port = 6000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

await connectMongoDB();

app.use("/", routes);

app.listen(port, () => {
    console.log("Server Listening on Port 6000.")
})