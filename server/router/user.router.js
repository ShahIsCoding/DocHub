const express = require("express");
const userModel = require("../model/user.Schema");
const CONSTANTS = require("../constants");
const router = express.Router();
const { getToken, verifyToken } = require("../utils/tokenUtils");

const { mongoose } = require("mongoose");

router
  .post("/login", async (req, res) => {
    try {
      let { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).send({ message: "Invalid data" });
      }

      const user = await userModel.findOne({ username: username });

      if (!user) {
        return res.status(404).send({ message: "User does not exist" });
      }

      const token = getToken(user._id);

      res.status(200).send({ message: "Logged In", token: token });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })
  .post("/register", async (req, res) => {
    try {
      let { username, password, name } = req.body;
      if (!username || !password) {
        return res.status(400).send({ message: "Invalid data" });
      }

      const existingUser = await userModel.findOne({ username: username });

      if (existingUser) {
        return res.status(400).send({ message: "User already exists" });
      }

      const body = {
        username: username,
        password: password,
        name,
      };

      const newUser = await userModel.create({ ...body });

      res.status(200).send({
        statusCode: 200,
        message: "User Created",
        token: getToken(newUser.id),
      });
    } catch (error) {
      res.status(500).send({ name: error.name, message: error.message });
    }
  })
  .get("/getUser", verifyToken, (req, res) => {
    let userId = req.decoded.data;
    userModel
      .findById(userId)
      .then((foundUser) => res.status(200).send(foundUser))
      .catch((err) =>
        res.status(500).send({ name: err.name, message: err.message })
      );
  })
  .get("/getDocuments", verifyToken, (req, res) => {
    let userId = req.decoded.data;
    userModel
      .findById(userId)
      .populate("documents")
      .then((user) => {
        const modifiedDocuments = user.documents.map((document) => {
          const { users, data, ...documentWithoutUsersAndData } =
            document.toObject();
          return documentWithoutUsersAndData;
        });

        res.status(200).send({ documents: modifiedDocuments });
      });
  });

module.exports = router;
