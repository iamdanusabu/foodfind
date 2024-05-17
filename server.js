const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = 3000;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/get-food-items', async (req, res) => {
  const { budget, mealType } = req.body;
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const prompt = `Four ${mealType} items under ${budget} ruppees`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ suggestions: text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
