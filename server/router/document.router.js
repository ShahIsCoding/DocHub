const express = require("express");
const router = express.Router();
const documentModel = require("../model/document.Schema");
const CONSTANTS = require("../constants");
const { verifyToken } = require("../utils/tokenUtils");
const userSchema = require("../model/user.Schema");

router.use(verifyToken);
router
  .get("/getDocument", (req, res) => {
    let { documentId } = req.body;
    documentModel
      .findOne({ id: documentId })
      .populate("users")
      .then((foundDocument) => {
        res.send({
          foundDocument,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message,
        });
      });
  })
  .post("/createDocument", (req, res) => {
    let { type } = req.body;
    let userId = req.decoded.data;
    documentModel
      .create({
        type,
        users: [userId],
      })
      .then(async (createDoc) => {
        let user = await userSchema.findById(userId);
        let documents = user.documents;
        user.documents = [...documents, createDoc._id];
        user.save();

        res.status(201).send(createDoc);
      })
      .catch((err) =>
        res.status(500).send({ name: err.name, message: err.message })
      );
  })
  .post("/saveDocument", async (req, res) => {
    try {
      let { documentId, data, name } = req.body;
      documentId = CONSTANTS.DOCUMENT + ":" + documentId;
      let foundDocument = await documentModel.findById(documentId);
      if (!foundDocument)
        return res.status(404).send({ message: "Doucment does not exist" });

      foundDocument.name = name;
      foundDocument.data = [...data];
      foundDocument.save();

      res.status(200).send({ message: "data Saved" });
    } catch (err) {
      res.status(500).send({ name: err.name, message: err.message });
    }
  })
  .delete("/removeDocument/:documentId", verifyToken, async (req, res) => {
    try {
      let documentId = req.params.documentId;
      console.log(documentId);
      let foundDocument = await documentModel.findById(documentId);

      let accessUsers = foundDocument.users;
      accessUsers.forEach(async (userid, idx) => {
        let user = await userSchema.findById(userid);
        let documents = user.documents.filter((id) => id !== documentId);
        user.documents = documents;
        user.save();
      });
      foundDocument.deleteOne();
      res.status(200).send({ message: "deleted" });
    } catch (err) {
      res.status(500).send({ name: err.name, message: err.message });
    }
  })
  .post("/addUser", (req, res) => {
    let { userId, documentId } = req.body;
    documentModel
      .findOne({ id: CONSTANTS.DOCUMENT + ":" + documentId })
      .then((req, res) => {
        if (req === null) {
          res.status(401).send({
            message: "Docuemnt Not Found",
          });
        } else {
          let users = [...req.user];
          if (users.indexOf(userId) == -1) users = [...users, user];
          res.status(200).send({ message: "updation done" });
        }
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message,
        });
      });
  });

module.exports = router;
