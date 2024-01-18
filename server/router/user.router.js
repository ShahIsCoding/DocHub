const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  let { username, password } = req.body;
});
router.post("/signup", (req, res) => {});

module.exports = router;
