const express = require("express");
const router = express.Router();

router
  .route("/whiteboard")
  .get("/getDocument", (req, res) => {
    let { users, elements } = req.body;
  })
  .post("/save", (req, res) => {});

module.exports = router;
