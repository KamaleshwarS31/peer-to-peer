const express = require("express");
const router = express.Router();
const File = require("../models/File");

router.get("/", async (req, res) => {
    try {
        const files = await File.find();
        res.json(files);
    }catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await File.findByIdAndDelete(req.params.id);
        res.json({ message: "File deleted successfully"});
    } catch (err) {
        res.status(500).json({message: err.message });
    }
});

module.exports = router;