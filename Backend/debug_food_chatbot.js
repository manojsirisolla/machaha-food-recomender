const axios = require("axios");

const OLLAMA_HOST = "http://localhost:11434";
const OLLAMA_MODEL = "llama3:latest";

async function callOllama(prompt, systemPrompt = null) {
  try {
    const payload = {
      model: OLLAMA_MODEL,
      prompt: prompt,
      stream: false,
    };

    if (systemPrompt) {
      payload.system = systemPrompt;
    }

    console.log("📤 Sending Ollama request:", JSON.stringify(payload, null, 2));

    const response = await axios.post(`${OLLAMA_HOST}/api/generate`, payload, {
      timeout: 30000
    });

    console.log("📥 Ollama response:", response.data);
    return response.data.response;
  } catch (error) {
    console.error("❌ Ollama API error:", error.message);
    console.error("❌ Full error:", error.response?.data || error);
    throw new Error("Failed to get response from AI model");
  }
}

async function testFoodChatbot() {
  try {
    console.log("🧪 Testing Food Chatbot Logic...");
    
    const message = "I want to cook pasta";
    console.log("📝 Message:", message);
    
    // Test food detection
    const foodKeywords = [
      "cook", "recipe", "make", "prepare", "dish", "food",
      "curry", "fry", "roast", "biryani", "masala", "gravy",
      "soup", "dessert", "snack", "meal", "pasta", "rice"
    ];
    
    const isFood = foodKeywords.some(word => message.toLowerCase().includes(word));
    console.log("🔍 Is food query:", isFood);
    
    if (isFood) {
      console.log("🍳 Testing dish name extraction...");
      
      // STEP 1: Extract dish name
      const extractPrompt = `
Extract ONLY the food dish name from this sentence.
If no dish is mentioned, return UNKNOWN.

Sentence: "${message}"
Dish:
`;

      const dishName = await callOllama(extractPrompt, "You are a helpful assistant that extracts food dish names. Return only the dish name or UNKNOWN.");
      console.log("🍽️ Extracted dish name:", dishName);
      
      if (dishName.trim() === "UNKNOWN") {
        console.log("❌ Could not extract dish name");
        return;
      }
      
      // STEP 2: Generate recipe
      console.log("👨‍🍳 Testing recipe generation...");
      
      const recipePrompt = `
Give a clear, simple recipe for: "${dishName}"

Rules:
- Ingredients list
- Step-by-step cooking method
- Cooking tips
- No self introduction
- No generic explanations
- Use simple language
`;

      const recipe = await callOllama(recipePrompt, "You are a professional chef AI that provides clear, practical cooking instructions.");
      console.log("📋 Generated recipe:", recipe);
      
      console.log("✅ Food chatbot test completed successfully!");
    }
    
  } catch (error) {
    console.error("❌ Food chatbot test failed:", error.message);
  }
}

testFoodChatbot();
