const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyBRChPO414UuxUfLfT0-wUr5wgc6J0W-RA';
const genAI = new GoogleGenerativeAI(API_KEY);

async function testModels() {
  try {
    const modelList = await genAI.listModels();
    console.log('Available models:');
    modelList.models.forEach(model => {
      console.log(`- ${model.name}`);
      console.log(`  Supported methods: ${model.supportedGenerationMethods?.join(', ') || 'none'}`);
    });
  } catch (error) {
    console.error('Error listing models:', error.message);
  }
}

testModels();
