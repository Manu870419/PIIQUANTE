const express = require("express");
const { getAllSauces, getSauce, createSauces, modifySauce, deleteSauce, likeSauce } = require("../controllers/sauces")
const auth = require("../middleware/auth");
const { upload } = require("../middleware/multer");
const saucesRouter = express.Router();

saucesRouter.get("/", auth, getAllSauces);
saucesRouter.get("/:id", auth, getSauce);
saucesRouter.post("/", auth, upload, createSauces);
saucesRouter.put("/:id", auth, upload, modifySauce);
saucesRouter.delete("/:id", auth, deleteSauce);
saucesRouter.post("/:id/like", auth, likeSauce);


module.exports = saucesRouter;