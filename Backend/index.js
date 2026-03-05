import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import routes from "./routes.js"
import connectMongoDB from "./Config/MongoDb.js";

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

await connectMongoDB();

app.use("/", routes);

app.listen(port, () => {
    console.log("Server Listening on Port 8000.")
})