
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");

router.get("/", ctrl.user.test);
router.post("/signup", ctrl.user.signup);
router.post("/login", ctrl.user.login);
router.put("/edit", ctrl.user.edit);
router.put("/editpet", ctrl.user.editPet);
router.get("/getprofile", ctrl.user.getUser);

module.exports = router;