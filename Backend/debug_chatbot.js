const axios = require("axios");

const OLLAMA_HOST = "http://localhost:11434";
const OLLAMA_MODEL = "llama3:latest";

async function testCallOllama() {
  try {
    console.log("🧪 Testing Ollama connection...");
    
    const payload = {
      model: OLLAMA_MODEL,
      prompt: "Say hello!",
      stream: false,
    };

    console.log("📤 Sending request:", JSON.stringify(payload, null, 2));
    
    const response = await axios.post(`${OLLAMA_HOST}/api/generate`, payload, {
      timeout: 30000
    });

    console.log("📥 Response received:", JSON.stringify(response.data, null, 2));
    
    return response.data.response;
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("❌ Full error:", error);
    throw error;
  }
}

testCallOllama().then(result => {
  console.log("✅ Success:", result);
}).catch(err => {
  console.log("❌ Failed:", err.message);
});
