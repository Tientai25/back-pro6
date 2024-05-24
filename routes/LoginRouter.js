const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const User = require("../db/userModel");
router.use(express.json());
const bcript = require("bcryptjs");

const jwt = require("jsonwebtoken");
const verifyToken = require("./jsontoken");

router.get("/", verifyToken, async (request, response) => {
    try {
        const users = await User.find({});
        response.send(users);
    } catch (error) {
        response.status(500).send({ error });
    }
});
router.post("/login", async (req, res) => {
    try {
        const check = await User.findOne({ username: req.body.username });
        if (!check) {
            return res.status(404).send({ message: "User not found" });
        }
        const isCorrect = await bcript.compare(req.body.password, check.password);
        if (isCorrect) {
            jwt.sign(
                { check },
                process.env.secretKey,
                { expiresIn: "2h" },
                (err, token) => {
                    if (err) {
                        return res.status(500).send("Error generating token");
                    } else {
                        return res.json({
                            user: check,
                            success: true,
                            msg: "User logged in successfully",
                            token,
                        });
                    }
                },
            );
            //res.status(200).send(check);
        } else {
            return res.status(401).send({ message: "Login failed" });
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
});
router.post("/sign", async (req, res) => {
    const { username } = req.body;
    try {
        const check = await User.findOne({ username });
        if (check) {
            return res.send({ message: "Username already exists" });
        }
        const salt = bcript.genSaltSync(10);
        const hashPassword = bcript.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hashPassword });
        //const user = new User(req.body);
        await newUser.save();
        res.status(200).send("Sign up successfully");
    } catch (error) {
        res.send({ message: "Internal server error" });
    }
});

module.exports = router;
