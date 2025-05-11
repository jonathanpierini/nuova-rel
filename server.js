const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { response: null });
});

app.post('/ask', async (req, res) => {
  const theme = req.body.theme;
  const question = req.body.question?.trim();

  let promptFile = 'prompts/act_prompt.txt';

  if (theme) {
    const fileMap = {
      ansia: 'ansia.txt',
      ossessioni: 'ossessioni.txt',
      relazioni: 'relazioni.txt',
      trauma: 'trauma.txt'
    };
    promptFile = `prompts/${fileMap[theme] || 'act_prompt.txt'}`;
  }

  try {
    const basePrompt = fs.readFileSync(path.join(__dirname, promptFile), 'utf-8');
    const fullPrompt = `${basePrompt}\n\nUtente: ${question || '...'}\nAssistente:`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4",
      messages: [{ role: "user", content: fullPrompt }],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const reply = response.data.choices[0].message.content;
    res.render('index', { response: reply });

  } catch (error) {
    console.error('Errore OpenAI:', error.message);
    res.render('index', { response: 'Si è verificato un errore nel generare la risposta.' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Mental Wealth LIVE sulla porta ${PORT}`);
});
