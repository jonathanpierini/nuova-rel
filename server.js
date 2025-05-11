
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { response: null });
});

app.post("/", async (req, res) => {
  const question = req.body.question;
  const promptPath = path.join(__dirname, "prompts", "act_prompt.txt");

  let systemPrompt = "Risposta terapeutica ACT.";
  if (fs.existsSync(promptPath)) {
    systemPrompt = fs.readFileSync(promptPath, "utf8");
  }

  try {
    const completion = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    const reply = completion.data.choices[0].message.content;
    res.render("index", { response: reply });
  } catch (error) {
    res.render("index", { response: "Errore: " + error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Mental Wealth LIVE sulla porta ${port}`);
});
