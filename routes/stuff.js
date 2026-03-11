const express = require("express");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const router = express.Router();
exports.router = router;

const {
  getOneThing,
  getAllThings,
  updateOneThing,
  deleteOneThing,
  createThing,
} = require("../controllers/thing");

router.get("/:id", auth, getOneThing);
router.get("/", auth, getAllThings);
router.put("/:id", auth, multer, updateOneThing);
router.delete("/:id", auth, deleteOneThing);
router.post("/", auth, multer, createThing);

module.exports = router;
