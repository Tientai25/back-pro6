const express = require("express");
const Photo = require("../db/photoModel");
const verifyToken = require("./jsontoken")
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage });


router.get("/:userId", verifyToken, async (request, response) => {
    try {
        const photo = await Photo.find({ user_id: request.params.userId });
        response.send(photo);
    } catch (error) {
        response.status(500).send({ error });
    }
});

router.post("/upphoto", verifyToken, async (req, res) => {
    try {
        const photo = new Photo({ ...req.body });
        console.log(req.body.user_id);
        await photo.save();
        res.status(200).send(photo);
    }
    catch (error) {
        res.status(401).send("Error");
    }
})

router.post("/upload", upload.single('file'), async (req, res) => {
    res.send(req.file);
})


router.post("/comment", verifyToken, async (req, res) => {
    try {
        const check = await Photo.findOne({ _id: req.body.photo_id })
        if (!check) {
            res.status(400).send("Photo not found");
        }
        else {
            check.comments.push({
                user_id: req.body.user_id,
                comment: req.body.comment
            })
            await check.save();
            console.log(req.body);
            res.status(200).send("Add successfully");
        }
    }
    catch (error) {
        res.status(404).send("Error")
    }
})



module.exports = router;
