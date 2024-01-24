const express = require("express");
const router = express.Router();
const documentModel = require("../model/document.Schema");
const constants = require("../constants");

function createDocument(req, res) {
  let { documentId, type } = req.body;
  documentId = constants.DOC + ":" + documentId;
  documentModel
    .create({ _id: documentId, type })
    .then((resp) => {
      res.status(201).send(resp);
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message,
      });
    });
}
router
  .get("/getDocument", (req, res) => {
    let { users, elements } = req.body;
    res.send("nive");
  })
  .post("/save", (req, res) => {
    createDocument(req, res);
  })
  .post("/addUser", (req, res) => {
    let { user, documentId } = req.body;
    documentModel
      .findById({ _id: documentId })
      .then((req, res) => {
        if (req === null) {
          createDocument(req, res);
        } else {
          res.send(req);
          documentModel.findByIdAndUpdate(
            { _id: documentId },
            { users: [...req.users, user] }
          );
        }
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message,
        });
      });
  });

module.exports = router;
