const { 
	getTransactions
} = require("./transaction.controller");
const router = require("express").Router();

router.get("/", getTransactions);

module.exports = router;