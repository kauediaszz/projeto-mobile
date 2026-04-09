const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const appJson = require('./app.json');

module.exports = () => ({
  expo: {
    ...appJson.expo,
    extra: {
      ...(appJson.expo.extra || {}),
      GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',
    },
  },
});
