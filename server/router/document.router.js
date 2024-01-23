const express = require("express");
const router = express.Router();
const documentModel = require("../model/document.Schema");

router
  .route("/document")
  .get("/getDocument", (req, res) => {
    let { users, elements } = req.body;
    res.send("nive");
  })
  .post("/save", (req, res) => {})
  .post("/addUser", (req, res) => {
    let { user, documentId } = req.body;
    documentModel
      .findById({ id: documentId })
      .then((req, res) => {
        if (req === null) {
          documentModel.create({ id: documentId, users: [user] }).then(req);
        } else {
          res.send(req);
          documentModel.findByIdAndUpdate({ id: documentId });
        }
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message,
        });
      });
  });

module.exports = router;
