const db = require("../models");
const express = require("express");
const {userList, userPages} = require("../views");

const router = express.Router();
module.exports = router;

router.get("/", (req, res, next) => {
    db.getAllUsers()
      .then(response => res.send(userList(response)))
      .catch(next);
});

router.get("/:id", (req, res, next) => {
    db.getUserById(req.params.id)
      .then(response => res.send(userPages(response, response.pages)))
      .catch(next);
});