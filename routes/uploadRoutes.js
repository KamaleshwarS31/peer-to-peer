const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Upload = require("../models/upload");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer ({ storage });

// POST - Uplaod a new file
router.post("/", upload.single("file"), async (req, res) => {
    try {
        const { course, topic, fileType } = req.body;
        if (!req.file) return res.status(400).json({message: "No file uploaded"});

        const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        const newUpload = new Upload({
            course,
            topic,
            fileType,
            filename: req.file.filename,
            fileUrl,
        });

        await newUpload.save();
        res.status(201).json({message: "File uploaded successfully", upload: newUpload });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({message: "Internal Server Error", error});
    }
});

// GET - Fetch all uploaded files
router.get("/", async (req, res) => {
    try {
        const uploads = await Upload.find().sort({uploadedAt: -1});
        res.status(200).json(uploads);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete
router.delete("/:id", async (req, res) => {
    try {
        await Upload.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Deleted successfully"});
    }catch (error){
        console.error("Delete Error:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
})

module.exports = router;