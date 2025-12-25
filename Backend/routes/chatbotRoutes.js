const express = require("express");
const axios = require("axios");
const router = express.Router();

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3:latest";
const OLLAMA_FAST_MODEL = process.env.OLLAMA_FAST_MODEL || "llama3:latest";

// Create optimized axios instance with connection pooling
const ollamaClient = axios.create({
  baseURL: OLLAMA_HOST,
  timeout: 30000, // Increased to 30s for better reliability
  headers: {
    'Content-Type': 'application/json',
  },
  // Connection pooling for better performance
  maxRedirects: 3,
  validateStatus: function (status) {
    return status < 500; // Only throw on 5xx errors
  }
});

// Simple in-memory cache for common queries
const responseCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100;

/* ---------------- CACHE MANAGEMENT ---------------- */

function getCacheKey(prompt, systemPrompt, isFood) {
  return `${isFood ? 'food' : 'general'}:${prompt.slice(0, 100)}:${systemPrompt ? 'with' : 'without'}`;
}

function getCachedResponse(key) {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.response;
  }
  return null;
}

function setCachedResponse(key, response) {
  // Clean up old entries if cache is too large
  if (responseCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = responseCache.keys().next().value;
    responseCache.delete(oldestKey);
  }
  
  responseCache.set(key, {
    response,
    timestamp: Date.now()
  });
}

/* ---------------- OPTIMIZED HELPER FUNCTION FOR OLLAMA ---------------- */

async function callOllama(prompt, systemPrompt = null, useFastModel = false) {
  const cacheKey = getCacheKey(prompt, systemPrompt, isFoodQuery(prompt));
  
  // Check cache first
  const cachedResponse = getCachedResponse(cacheKey);
  if (cachedResponse) {
    console.log("📦 Returning cached response");
    return cachedResponse;
  }

  try {
    const payload = {
      model: useFastModel ? OLLAMA_FAST_MODEL : OLLAMA_MODEL,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        // Add performance optimizations
        num_predict: 512, // Limit response length for speed
      }
    };

    if (systemPrompt) {
      payload.system = systemPrompt;
    }

    const response = await ollamaClient.post('/api/generate', payload);

    if (response.data && response.data.response) {
      // Cache the successful response
      setCachedResponse(cacheKey, response.data.response);
      return response.data.response;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Ollama API error:", error.message);
    
    // Try fallback to fast model if main model fails
    if (!useFastModel && error.code !== 'ECONNREFUSED') {
      console.log("🔄 Trying fast model as fallback...");
      try {
        return await callOllama(prompt, systemPrompt, true);
      } catch (fallbackError) {
        console.error("Fallback model also failed:", fallbackError.message);
      }
    }
    
    throw new Error("Failed to get response from AI model");
  }
}

/* ---------------- HELPER FUNCTIONS ---------------- */

// Check if query is food-related
function isFoodQuery(message) {
  const foodKeywords = [
    "cook", "recipe", "make", "prepare", "dish", "food",
    "curry", "fry", "roast", "biryani", "masala", "gravy",
    "soup", "dessert", "snack", "meal", "pasta", "rice"
  ];
  return foodKeywords.some(word => message.includes(word));
}

// Remove bad / generic AI replies
function isBadAIResponse(text) {
  const badPhrases = [
    "i can help",
    "as an ai",
    "i am",
    "virtually any topic",
    "i understand you're asking"
  ];
  return badPhrases.some(p => text.toLowerCase().includes(p));
}

/* ---------------- HEALTH CHECK ROUTE ---------------- */

router.get("/health", async (req, res) => {
  try {
    // Simple health check - test Ollama connection
    const testResponse = await ollamaClient.post('/api/generate', {
      model: OLLAMA_FAST_MODEL,
      prompt: 'Hi',
      stream: false,
      options: { num_predict: 1 }
    });
    
    res.json({
      success: true,
      status: 'healthy',
      timestamp: Date.now(),
      model: OLLAMA_FAST_MODEL,
      cache_size: responseCache.size
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: error.message,
      timestamp: Date.now()
    });
  }
});

/* ---------------- CHATBOT ROUTE ---------------- */

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        response: "Please send a valid message."
      });
    }

    const lowerMessage = message.toLowerCase();

    /* ---------- OPTIMIZED FOOD CHATBOT ---------- */
    if (isFoodQuery(lowerMessage)) {

      // Single optimized call for both dish extraction and recipe generation
      const optimizedPrompt = `
You are a helpful cooking assistant. 

User asked: "${message}"

Respond in this format:
DISH: [dish name or "UNKNOWN" if no dish mentioned]
RECIPE: [simple recipe for the dish, or ask for clarification if dish unknown]

Keep the recipe concise but complete with ingredients and basic steps.
`;

      const response = await callOllama(optimizedPrompt, "You are a cooking expert. Respond with dish name and recipe in the specified format.", true);

      // Parse the response
      const lines = response.split('\n');
      let dishName = '';
      let recipe = '';

      for (const line of lines) {
        if (line.startsWith('DISH:')) {
          dishName = line.replace('DISH:', '').trim();
        } else if (line.startsWith('RECIPE:')) {
          recipe = line.replace('RECIPE:', '').trim();
        }
      }

      // Fallback parsing if format is different
      if (!dishName || !recipe) {
        const parts = response.split('RECIPE:');
        if (parts.length > 1) {
          const dishPart = parts[0];
          const recipePart = parts[1];
          
          const dishMatch = dishPart.match(/DISH:\s*(.+)/);
          if (dishMatch) dishName = dishMatch[1].trim();
          recipe = recipePart.trim();
        }
      }

      // Handle unknown dish
      if (dishName.toUpperCase() === 'UNKNOWN' || !dishName) {
        return res.json({
          success: true,
          response: "Please tell me the dish name and I'll give you the recipe 🍳"
        });
      }

      // Validate recipe quality
      if (recipe && recipe.length > 30 && !isBadAIResponse(recipe)) {
        return res.json({
          success: true,
          response: `**${dishName}**\n\n${recipe}`
        });
      }

      // Enhanced fallback with options
      return res.json({
        success: true,
        response: `I can help you cook ${dishName}! What would you prefer:\n🌶️ Spicy version\n🥬 Vegetarian twist\n⏱️ Quick 15-minute version\n🍛 Traditional recipe`
      });
    }

    /* ---------- OPTIMIZED NON-FOOD CHATBOT ---------- */
    const generalPrompt = `
Answer the question clearly and directly.
No self introduction.
No generic text.

Question: "${message}"
`;

    const generalAnswer = await callOllama(generalPrompt, "You are a helpful assistant that answers questions clearly and directly.", true);

    return res.json({
      success: true,
      response: generalAnswer
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({
      success: false,
      response: "⚠️ Something went wrong. Please try again."
    });
  }
});

module.exports = router;
