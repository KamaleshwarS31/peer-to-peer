const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadRoutes = require('./routes/uploadRoutes');
const fileRoutes = require('./routes/fileRoutes');
const { Server } = require("socket.io");
const http = require("http");
const Chat = require('./models/chat');
const challengeRoutes = require('./routes/challengeRoutes.js');

const app = express();
const server = http.createServer(app);
// const io = require("socket.io")(server, {
//   cors: {origin: "*"}
// });
const io = new Server(server, {
  cors: { origin: "*" }
});
app.use(cors());
app.use(express.json()); // for JSON requests (non-file)
app.use('/api/uploads', uploadRoutes);
app.use('/api/files', fileRoutes);
app.use('/uploads', express.static(path.join(__dirname, "uploads")));
app.use('/uploads/challenges', express.static(path.join(__dirname, "uploads/challenges")));
app.use('/api/challenges', challengeRoutes);


// MongoDB connection
mongoose.connect('mongodb+srv://shalini:Shalini%4016@cluster0.n6dz2hn.mongodb.net/peer_learning')
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Schema for storing file metadata
const fileSchema = new mongoose.Schema({
  course: String,
  topic: String,
  filename: String,
  contentType: String,
  data: Buffer,
});

// const File = mongoose.model('File', fileSchema);

// Multer storage config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// When client connects
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // Send all previous chat
  Chat.find().then(chats => socket.emit("loadChats", chats));

  // When a message is sent
  socket.on("sendMessage", async (data) => {
    const newChat = new Chat(data);
    await newChat.save();
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

const chatRooms = {};

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinCourse", (course) => {
    socket.join(course);
    console.log(`User Joined course: ${course}`);
  });

  socket.on("sendMessage", (msg) => {
    const m = {...msg, user: msg.user === "You" ? "Anonymous" : msg.user };
    io.to(msg.course).emit("message", m);
  });

  socket.on("disconnect", () => console.log("User Disconnected"));
});

server.listen(5000, () => console.log("Server running on port 5000"));

// Upload route (handles multipart form)
// app.post('/api/upload', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//     const newFile = new File({
//       course: req.body.course,
//       topic: req.body.topic,  
//       filename: req.file.originalname,
//       contentType: req.file.mimetype,
//       data: req.file.buffer,
//     });

//     await newFile.save();
//     res.json({ message: "✅ File uploaded successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Upload failed" });
//   }
// });


// // Serve uploaded files statically
// app.use('/uploads', express.static('uploads'));

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

