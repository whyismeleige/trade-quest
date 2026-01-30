const dotenv = require('dotenv');
dotenv.config();

if (!process.env.ELEVENLABS_API_KEY) {
  console.error("FATAL: ELEVENLABS_API_KEY is missing in .env");
  process.exit(1);
}

module.exports = {
  port: process.env.PORT || 3000,
  elevenLabs: {
    apiKey: process.env.ELEVENLABS_API_KEY,
    // Default to Flash v2.5 for speed (75ms latency)
    modelId: process.env.ELEVENLABS_MODEL_ID || 'eleven_flash_v2_5',
  },
};