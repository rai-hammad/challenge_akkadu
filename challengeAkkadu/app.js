require("dotenv").config();
const express = require("express");
const app = express();

const transactionRouter = require("./api/transactions/transaction.router");


app.use(express.json()); // use this or bodyparser to get the json data

app.use("/api/transactions", transactionRouter);

port = process.env.APP_PORT
app.listen(port, () => {
	console.log(`Server up and running in port ${port}`);
});