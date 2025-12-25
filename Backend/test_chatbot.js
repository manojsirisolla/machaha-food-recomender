const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Load API key
const API_KEY = process.env.GOOGLE_AI_API_KEY;

console.log("🔍 API Key Check:");
console.log("API_KEY exists:", !!API_KEY);
console.log("API_KEY length:", API_KEY ? API_KEY.length : 0);
console.log("API_KEY starts with:", API_KEY ? API_KEY.substring(0, 10) + "..." : "NOT FOUND");

if (!API_KEY) {
  console.error("❌ GOOGLE_AI_API_KEY is missing in .env file");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/test-chat", async (req, res) => {
  try {
    const { message } = req.body;
    
    console.log("🧪 Testing with message:", message);
    
    const testPrompt = `Say "Hello! The chatbot is working correctly." in response to: "${message}"`;
    const result = await model.generateContent(testPrompt);
    const response = result.response.text();
    
    console.log("✅ AI Response:", response);
    
    res.json({
      success: true,
      response: response,
      debug: {
        apiKeyExists: !!API_KEY,
        message: message
      }
    });
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      debug: {
        apiKeyExists: !!API_KEY,
        errorType: error.constructor.name
      }
    });
  }
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`🚀 Test chatbot server running on port ${PORT}`);
});
