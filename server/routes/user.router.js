const express = require("express");
const userModel = require("../model/user.Schema");
const documentModel = require("../model/document.Schema");
const router = express.Router();
const { getToken, verifyToken } = require("../utils/tokenUtils");

const { handleError } = require("../utils/errorUtils");
// routes/user.router
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */

router
  .get("/refreshLogin", verifyToken, async (req, res, next) => {
    try {
      let userId = req.decoded.data;
      const user = await userModel.findById(userId);
      if (!user) next(handleError(404, "User does not exist"));
      const token = getToken(userId);
      res.status(200).json({ message: "Logged In", token: token, _id: userId });
    } catch (error) {
      next(error);
    }
  })
  .post("/login", async (req, res, next) => {
    try {
      let { username, password } = req.body;
      if (!username || !password) next(handleError(400, "Invalid Data"));

      const user = await userModel.findOne({ username: username });

      if (!user) next(handleError(404, "User does not exist"));
      if (user.password !== password)
        next(handleError(400, "Wrong password or username"));
      const token = getToken(user._id);

      res
        .status(200)
        .json({ message: "Logged In", token: token, _id: user._id });
    } catch (error) {
      next(error);
    }
  })
  .post("/register", async (req, res, next) => {
    try {
      let { username, password, name } = req.body;
      if (!username || !password)
        next(handleError(400, "Invalid Username or password"));

      const existingUser = await userModel.findOne({ username: username });
      if (existingUser) next(handleError(400, "User Already exist"));

      const body = {
        username: username,
        password: password,
        name,
      };

      const newUser = await userModel.create({ ...body });

      res.status(200).json({
        statusCode: 200,
        message: "User Created",
        token: getToken(newUser._id),
        _id: newUser._id,
      });
    } catch (error) {
      next(err);
    }
  })
  .get("/getUser", verifyToken, (req, res, next) => {
    let userId = req.decoded.data;
    userModel
      .findById(userId)
      .then((foundUser) => res.status(200).send(foundUser))
      .catch((err) => next(err));
  })
  .get("/getDocuments", verifyToken, (req, res, next) => {
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

        res.status(200).json({ documents: modifiedDocuments });
      })
      .catch((err) => next(err));
  })
  .post("/addUsers", verifyToken, async (req, res, next) => {
    let { usernames, documentId } = req.body;
    try {
      const users = await userModel.find({ username: { $in: usernames } });
      const userIds = users.map((user) => user._id);
      const documentUpdate = await documentModel.findByIdAndUpdate(
        documentId,
        { $addToSet: { users: { $each: userIds } } },
        { new: true }
      );
      const userUpdate = await userModel.updateMany(
        { username: { $in: usernames } },
        { $addToSet: { documents: documentId } }
      );

      res.status(200).json({ documentUpdate, userUpdate });
    } catch (err) {
      next(err);
    }
  });

module.exports = router;
