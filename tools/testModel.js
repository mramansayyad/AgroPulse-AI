import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const key = envFile
  .split('\n')
  .find((line) => line.startsWith('VITE_GEMINI_API_KEY'))
  .split('=')[1]
  .trim();

async function testModel() {
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-pro-preview' });

  try {
    const result = await model.generateContent('Hello, what is your name?');
    console.log('Success:', result.response.text());
  } catch (e) {
    console.error('Error with gemini-3.1-pro-preview:', e.message);
  }
}

testModel();
