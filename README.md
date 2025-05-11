# MentalChatNew – Piattaforma di risposta ACT in JavaScript

**MentalChatNew** è una piattaforma terapeutica conversazionale sviluppata in Node.js e basata sull’Acceptance and Commitment Therapy (ACT).  
Utilizza un prompt raffinato per offrire risposte non direttive, accoglienti e radicate nei valori ACT, con integrazioni da autori come Hayes, Liotti, Fisher e Beck.

---

## Funzionalità principali

- Linguaggio ACT terapeutico e validante
- Prompt GPT personalizzabile via file `act_prompt.txt`
- Backend in Node.js + Express
- Frontend con `EJS` e `CSS`
- Compatibile con Render e Vercel per deploy rapido

---

## Installazione locale

### 1. Clona la repository

```bash
git clone https://github.com/TUO_USERNAME/mentalchatnew.git
cd mentalchatnew
```

### 2. Installa le dipendenze

```bash
npm install
```

### 3. Configura l’ambiente

Rinomina `env-example.txt` in `.env` e aggiungi la tua chiave API OpenAI:

```
OPENAI_API_KEY=sk-...
```

---

## Avvio

```bash
npm start
```

Vai su `http://localhost:3000` per iniziare.

---

## Deploy su Render

1. Vai su [https://render.com](https://render.com)
2. Clicca “New Web Service” e collega la tua repo GitHub
3. Impostazioni:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** aggiungi `OPENAI_API_KEY` come variabile

---

## Struttura del progetto

```
mentalchatnew/
├── prompts/
│   └── act_prompt.txt      # prompt terapeutico ACT
├── views/
│   └── index.ejs           # interfaccia utente
├── public/
│   └── style.css           # stile grafico
├── server.js               # server Express
├── package.json            # configurazione Node.js
├── env-example.txt         # esempio file .env
```

---

## Licenza

Uso libero con attribuzione.  
MentalChatNew non fornisce diagnosi cliniche, ma uno spazio di ascolto e consapevolezza ispirato all’ACT.

---

## Creato da

**Jonathan Pierini**  
Con supporto AI per la struttura terapeutica e ingegneria del prompt.
