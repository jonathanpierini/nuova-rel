const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Home page
app.get('/', (req, res) => {
  res.render('index', { response: null });
});

// Gestione POST /ask
app.post('/ask', async (req, res) => {
  const userInput = req.body.question || '';
  const theme = req.body.theme || '';

  try {
    const messages = [
      {
        role: 'system',
        content: process.env.SYSTEM_PROMPT || 'Sei un assistente terapeutico basato sull’ACT. Accogli con empatia, guida con delicatezza, non fornire diagnosi.'
      },
      {
        role: 'user',
        content: `${theme ? `[Tema: ${theme}] ` : ''}${userInput}`
      }
    ];

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: messages
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.render('index', { response: reply });
  } catch (error) {
    console.error('Errore OpenAI:', error.message);
    res.render('index', { response: 'Si è verificato un errore nel generare la risposta. Riprova più tardi.' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Mental Wealth LIVE sulla porta ${PORT}`);
});



app.listen(port, () => {
  console.log(`Mental Wealth LIVE sulla porta ${port}`);
});
