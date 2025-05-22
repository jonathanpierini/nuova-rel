const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Halifax Prompt Adaptor
const { calculateHalifaxProfile } = require('./utils/halifax');
const questions = require('./quiz/questions.json');

function getDominantPole(profile) {
  return Object.entries(profile).sort((a, b) => b[1] - a[1])[0][0];
}

function getTone(pole) {
  const tones = {
    defusion: "concentrato sulla separazione dai pensieri disturbanti",
    values: "ispirato dai tuoi valori più autentici",
    acceptance: "accogliente verso le emozioni difficili",
    contact: "radicato nel momento presente",
    selfAsContext: "centrato sul tuo Sé osservante",
    committedAction: "orientato all'azione impegnata"
  };
  return tones[pole] || "centrato sul benessere psicologico";
}

// ROTTA QUIZ: riceve risposte e salva il profilo
let lastProfile = null;

app.post('/api/quiz/submit', (req, res) => {
  const responses = req.body.responses;
  lastProfile = calculateHalifaxProfile(responses);
  res.json({ profile: lastProfile });
});

// ROTTA CHAT
app.get('/', (req, res) => {
  res.render('index', { response: null });
});

app.post('/ask', async (req, res) => {
  const question = req.body.question?.trim();
  const promptFile = 'prompts/act_prompt.txt';

  try {
    const basePrompt = fs.readFileSync(path.join(__dirname, promptFile), 'utf-8');

    let promptTone = "";
    if (lastProfile) {
      const pole = getDominantPole(lastProfile);
      const tone = getTone(pole);
      promptTone = `\n\n[Adattamento Halifax: il tono della risposta sarà ${tone} perché il tuo profilo attuale mostra prevalenza nel polo ACT "${pole}"]`;
    }

    const fullPrompt = `${basePrompt}${promptTone}\n\nUtente: ${question}\nAssistente:`;

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
    console.error("Errore OpenAI:", error.message);
    res.render('index', { response: "Si è verificato un errore nel generare la risposta." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Mental Wealth LIVE sulla porta ${PORT}`);
});
