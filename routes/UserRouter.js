const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const verifyToken = require("./jsontoken")
router.post("/", async (request, response) => { });

router.get("/", verifyToken, async (request, response) => {
    try {
        const users = await User.find({});
        response.send(users);
    } catch (error) {
        response.status(500).send({ error });
    }
});
router.get("/:userId", verifyToken, async (request, response) => {
    try {
        const id = request.params.userId;
        const user = await User.findOne({ _id: id });

        // Check if user exists before sending response
        if (!user) {
            return response.status(404).send({ message: "User not found" });
        }
        // Send the user data in JSON format with appropriate headers
        response.setHeader("Content-Type", "application/json");
        response.send(user);
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        response.status(500).send({ error: "Internal Server Error" });
    }
});


module.exports = router;
