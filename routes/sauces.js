const express = require("express");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer");
const ctrlSauces = require("../controllers/sauces");
const router = express.Router();

router.get("/", auth, ctrlSauces.getAllSauces);
router.get("/:id", auth, ctrlSauces.getSauce);
router.post("/", auth, multer.upload, ctrlSauces.createSauces);
router.put("/:id", auth, multer.upload, ctrlSauces.modifySauce);
router.delete("/:id", auth, ctrlSauces.deleteSauce);
router.post("/:id/like", auth, ctrlSauces.likeSauce);
router.get("/", (req, res) => res.send("Hello World"))

module.exports = router;