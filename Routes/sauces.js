const express = require("express");
const auth = require("../Middleware/auth");
const upload = require("../Middleware/multer");
const ctrlSauces = require("../Controllers/sauces");
const router = express.Router();

router.get("/", auth, ctrlSauces.getAllSauces);
router.get("/:id", auth, ctrlSauces.getSauce);
router.post("/", auth, upload, ctrlSauces.createSauces);
router.put("/:id", auth, upload, ctrlSauces.modifySauce);
router.post("/:id/like", auth, ctrlSauces.likeSauce);
router.delete("/:id", auth, ctrlSauces.deleteSauce);

module.exports = {router};