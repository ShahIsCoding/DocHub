const express = require("express");
const router = express.Router();
const documentModel = require("../model/document.Schema");
const CONSTANTS = require("../constants");
const { verifyToken } = require("../utils/tokenUtils");
const userSchema = require("../model/user.Schema");
const { handleError } = require("../utils/errorUtils");

router.use(verifyToken);
router
  .get("/getDocument:id", (req, res, next) => {
    let { id: documentId } = req.params;
    documentModel
      .findById(CONSTANTS.DOCUMENT + documentId)
      .populate("users")
      .then((foundDocument) => {
        res.json({
          document: foundDocument,
        });
      })
      .catch((err) => {
        next(err);
      });
  })
  .post("/createDocument", async (req, res, next) => {
    let { type } = req.body;
    let userId = req.decoded.data;
    try {
      let createdDocument = await documentModel.create({
        type,
        users: [userId],
      });
      let user = await userSchema.findById(userId);
      let documents = user.documents;
      user.documents = [...documents, createdDocument._id];
      user.save();
      res.status(201).json({
        message: "A new document created",
        _id: createdDocument._id,
        type: createdDocument.type,
      });
    } catch {
      (err) => {
        next(err);
      };
    }
  })
  .post("/saveDocument", async (req, res, next) => {
    try {
      let { documentId, data, name } = req.body;
      documentId = CONSTANTS.DOCUMENT + ":" + documentId;
      let foundDocument = await documentModel.findById(documentId);
      if (!foundDocument) next(handleError(404, "Doucment does not exist"));

      foundDocument.name = name;
      foundDocument.data = [...data];
      foundDocument.save();

      res.status(200).json({ message: "Document has been saved" });
    } catch (err) {
      next(err);
    }
  })
  .delete(
    "/removeDocument/:documentId",
    verifyToken,
    async (req, res, next) => {
      try {
        let documentId = req.params.documentId;

        let foundDocument = await documentModel.findById(documentId);

        let accessUsers = foundDocument.users;
        accessUsers.forEach(async (userid, idx) => {
          let user = await userSchema.findById(userid);
          let documents = user.documents.filter((id) => id !== documentId);
          user.documents = documents;
          user.save();
        });
        foundDocument.deleteOne();
        res.status(200).json({ message: `${foundDocument.name} deleted` });
      } catch (err) {
        next(err);
      }
    }
  )
  .post("/addUser", (req, res, next) => {
    let { userId, documentId } = req.body;
    documentModel
      .findOne({ id: CONSTANTS.DOCUMENT + ":" + documentId })
      .then((req, res) => {
        if (req === null) {
          res.status(404).send({
            message: "Docuemnt Not Found",
          });
        } else {
          let users = [...req.user];
          if (users.indexOf(userId) == -1) users = [...users, user];
          res.status(200).json({ message: "updation done" });
        }
      })
      .catch((err) => {
        next(err);
      });
  });

module.exports = router;
