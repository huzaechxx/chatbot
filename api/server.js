const express = require("express");
const mongoose = require("mongoose");
const Chat = require("./model/chat"); // Adjust the path as needed
const userRoutes = require("./routes/userroutes");
const marked = require("marked");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 3000;

// Initialize GoogleGenerativeAI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

mongoose
  .connect("mongodb://localhost:27017/chatbot", {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Initial route - render the form without any response

// Handle form submission
app.post("/chat", async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ response: "Error: Prompt is required" });
  }

  try {
    const result = await model.generateContent(prompt);
    const formattedResponse = marked.parse(result.response.text());
    const chat = new Chat({ prompt, response: formattedResponse });
    console.log("Saving chat:", chat);

    await chat.save();
    res.json({ response: formattedResponse });
  } catch (error) {
    console.error("Error generating content:", error.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
