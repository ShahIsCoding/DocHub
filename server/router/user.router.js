const express = require("express");
const userModel = require("../model/user.Schema");
const CONSTANTS = require("../constants");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { getToken } = require("../utils/tokenUtils");

router.post("/login", (req, res) => {
  let { username, password } = req.body;
  userModel
    .findOne({ username: username })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "user does not exists" });
      } else {
        let token = getToken(user.id);
        res.status(200).send({ message: "logged In", user: user, token });
      }
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
});

router.post("/register", (req, res) => {
  let { username, password } = req.body;
  userModel
    .findOne({ username: username })
    .then((user) => {
      if (!user) {
        let body = {
          username: username,
          password: password,
          id: CONSTANTS.USER + ":" + uuidv4(),
        };
        let token = getToken(body.id);
        userModel
          .create(body)
          .then((resp) => {
            res.status(200).cookie(token).send({
              statusCode: 200,
              message: "User Created",
              token: token,
            });
          })
          .catch((err) => {
            res.status(400).send({ message: err.message });
          });
      } else {
        res.status(400).send({ message: "user already exists" });
      }
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
});

module.exports = router;
