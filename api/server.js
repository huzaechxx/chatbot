const express = require("express");
const mongoose = require("mongoose");
const Chat = require("./model/chat");
const userRoutes = require("./routes/userroutes");
const marked = require("marked");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://chatbot-5jnhangz7-huzaifa-zahids-projects.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// API route
app.post("/api/chat", async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ response: "Error: Prompt is required" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const formattedResponse = marked.parse(result.response.text());
    const chat = new Chat({ prompt, response: formattedResponse });
    await chat.save();

    res.json({ response: formattedResponse });
  } catch (error) {
    console.error("Error generating content:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Serve static files for React in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
