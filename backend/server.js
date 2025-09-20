// 1️⃣ Load environment variables first
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(express.json());

// 2️⃣ Debug check (optional, remove later)
console.log("DEBUG: MONGO_URI =", process.env.MONGO_URI);

// 3️⃣ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Stop app if DB connection fails
});

// 4️⃣ Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
