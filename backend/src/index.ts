import express from "express";
import routes from "./routes/router";
import * as dotenv from "dotenv";
import dbConnect from "./config/db";
import cookieParser from "cookie-parser";

dotenv.config();

dbConnect(process.env.DB_DEV as string);

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static("./public"));

app.use("/api", routes);


app.listen(PORT, () => {
    console.log(`Listening ${PORT}`);
});