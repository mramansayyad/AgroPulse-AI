import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const key = envFile
  .split('\n')
  .find((line) => line.startsWith('VITE_GEMINI_API_KEY'))
  .split('=')[1]
  .trim();

async function listModels() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
    );
    const data = await response.json();
    console.log(data.models.map((m) => m.name).filter((n) => n.includes('gemini-3')));
  } catch (e) {
    console.error(e);
  }
}

listModels();
