const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");

router.get("/", ctrl.packages.index);
router.put("/buypack",ctrl.packages.buy);
module.exports = router;