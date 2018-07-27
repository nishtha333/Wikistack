const db = require("../models");
const express = require("express");
const {addPage, wikiPage, main} = require("../views");

const router = express.Router();
module.exports = router;

router.get("/", (req, res, next) => {
    db.getAllPages()
      .then(response => res.send(main(response)))
      .catch(next);
});

router.get("/add", (req, res, next) => {
    res.send(addPage());
});

router.get("/:slug", (req, res, next) => {
    db.getPageBySlug(req.params.slug)
      .then(response => res.send(wikiPage(response, response.user)))
      .catch(next);
});

router.post("/", async (req, res, next) => {
    //To display the user-entered text as json (to test): res.json(req.body);
    try {
        const page = await db.addPage(req.body.title, req.body.content, req.body.status, 
                                req.body.name, req.body.email);
        res.redirect(`/wiki/${page.slug}`);
    }
    catch(ex) {
        next(ex);
    }
});