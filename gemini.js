const PORT = 8000;
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

app.post("/gemini", async (req, res) => {
  // console.log(req.body.history);
  // console.log(req.body.message);

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: req.body.history,
  });

  const msg = req.body.message;

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  res.send(text);
});

app.listen(PORT, () => console.log("Listening on PORT: ", PORT));

// async function run() {
//   // For text-only input, use the gemini-pro model
//   const model = genAI.getGenerativeModel({ model: "gemini-pro"});

//   const chat = model.startChat({
//     history: [
//       {
//         role: "user",
//         parts: "Hello, I have 2 dogs in my house.",
//       },
//       {
//         role: "model",
//         parts: "Great to meet you. What would you like to know?",
//       },
//     ],
//     generationConfig: {
//       maxOutputTokens: 100,
//     },
//   });

//   const msg = "what is capital of india??"

//   const result = await chat.sendMessage(msg);
//   const response = await result.response;
//   const text = response.text();
//   console.log(text);
// }

// run();
