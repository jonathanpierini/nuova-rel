const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { response: null });
});

app.post('/', async (req, res) => {
  const userInput = req.body.prompt;

  try {
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: process.env.SYSTEM_PROMPT },
          { role: 'user', content: userInput }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = openaiResponse.data.choices[0].message.content;
    res.render('index', { response: reply });
  } catch (error) {
    console.error(error.message);
    res.render('index', { response: 'Errore nella generazione della risposta.' });
  }
});

app.listen(port, () => {
  console.log(`Mental Wealth LIVE sulla porta ${port}`);
});
