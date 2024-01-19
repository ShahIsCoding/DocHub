const express = require("express");
const userAuthModel = require("../model/user.auth");
const CONSTANTS = require("../constants");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { getToken } = require("../utils/tokenUtils");
router.post("/login", (req, res) => {
  let { username, password } = req.body;
  userAuthModel.findOne({ username }).then((resp) => {
    if (resp.password === password) {
      let token = getToken(resp.id);
      res.status(201).cookie(token).send({
        statusCode: 200,
        message: "User Login",
        token: token,
      });
    }
  });
});
router.post("/register", (req, res) => {
  let { username, password } = req.body;
  userAuthModel
    .findOne({ username: username })
    .then((user) => {
      if (!user) {
        let body = {
          username: username,
          password: password,
          id: CONSTANTS.USER + ":" + uuidv4(),
        };
        let token = getToken(body.id);
        userAuthModel
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
        res.status(400).send({ message: "user already exists", user: user });
      }
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
});

module.exports = router;
