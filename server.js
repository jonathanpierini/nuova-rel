const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { response: null });
});

app.post('/ask', async (req, res) => {
  const userInput = req.body.question;
  const theme = req.body.theme || "ansia";
  const promptPath = path.join(__dirname, 'prompts', `${theme}.txt`);

  const promptBase = fs.readFileSync(promptPath, 'utf8');
  const prompt = `${promptBase}
Utente: ${userInput}
Risposta terapeutica:`;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 500,
      temperature: 0.7,
    });
    res.render('index', { response: completion.data.choices[0].text.trim() });
  } catch (e) {
    res.render('index', { response: "Errore nella generazione della risposta." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("MentalChat avviato sulla porta " + PORT));
