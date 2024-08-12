const path = require('path');
const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config();
const multer = require('multer'); // For handling file uploads
const fs = require('fs'); // For file system operations
const nodemailer = require('nodemailer'); // For sending emails

const app = express();
app.use(express.static(path.join(__dirname, "public")));
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data

// Set up multer for handling image uploads (for Vision-X)
const upload = multer({ dest: 'uploads/' });

const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

const prompts = {
  "ChatX": [
    {
      role: "user",
      parts: [{ text: "You are ChatX, a friendly assistant who works for InfoTech-X." }],
    },
    {
      role: "model",
      parts: [{ text: "Hello! Welcome to InfoTech-X. My name is ChatX. What's your name?" }],
    },
  ],
  "Summarizer": [
    {
      role: "user",
      parts: [{ text: "You are Summarizer, a chatbot that specializes in summarizing long texts." }],
    },
    {
      role: "model",
      parts: [{ text: "Hello! I’m Summarizer. Provide me with the text you'd like summarized, and I'll condense it for you." }],
    },
  ],
  "Explainer": [
    {
      role: "user",
      parts: [{ text: "You are Explainer, a chatbot that specializes in breaking down complex concepts into simple explanations." }],
    },
    {
      role: "model",
      parts: [{ text: "Hello! I’m Explainer. Share any concept with me, and I'll explain it in a simple and easy-to-understand way." }],
    },
  ],
  "Programmer": [
    {
      role: "user",
      parts: [{ text: "You are Programmer, a chatbot that helps with coding tasks and programming queries." }],
    },
    {
      role: "model",
      parts: [{ text: "Hi! I’m Programmer. Tell me what coding task you're working on, and I'll assist you with it." }],
    },
  ],
  "ProblemSetter": [
    {
      role: "user",
      parts: [{ text: "You are Problem Setter, a chatbot that generates programming problems for practice." }],
    },
    {
      role: "model",
      parts: [{ text: "Hello! I’m Problem Setter. What level of programming problems are you looking for? (Beginner, Intermediate, Advanced)" }],
    },
  ],
  "MathSolver": [
    {
      role: "user",
      parts: [{ text: "You are Math Solver, a chatbot that solves math problems." }],
    },
    {
      role: "model",
      parts: [{ text: "Hi! I’m Math Solver. Share any math problem with me, and I'll help you solve it." }],
    },
  ],
  "Interviewer": [
    {
      role: "user",
      parts: [{ text: "You are Interviewer, a chatbot that conducts mock interviews." }],
    },
    {
      role: "model",
      parts: [{ text: "Hello! I’m Interviewer. What kind of interview would you like to practice? (Technical, Behavioral, etc.)" }],
    },
  ],
  "Vision-X": [
    {
      role: "user",
      parts: [{ text: "You are Vision-X, a chatbot that specializes in analyzing and describing photos." }],
    },
    {
      role: "model",
      parts: [{ text: "Hello! I’m Vision-X. Please upload an image, and I'll analyze it for you." }],
    },
  ],
};

async function runChat(userInput, botName) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: prompts[botName],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

// Chat endpoints
app.post('/chat1', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat1 req', userInput);
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput, "ChatX");
    res.json({ response });
  } catch (error) {
    console.error('Error in chat1 endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/chat2', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat2 req', userInput);
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput, "Summarizer");
    res.json({ response });
  } catch (error) {
    console.error('Error in chat2 endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/chat3', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat3 req', userInput);
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput, "Explainer");
    res.json({ response });
  } catch (error) {
    console.error('Error in chat3 endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/chat4', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat4 req', userInput);
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput, "Programmer");
    res.json({ response });
  } catch (error) {
    console.error('Error in chat4 endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/chat5', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat5 req', userInput);
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput, "ProblemSetter");
    res.json({ response });
  } catch (error) {
    console.error('Error in chat5 endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/chat6', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat6 req', userInput);
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput, "MathSolver");
    res.json({ response });
  } catch (error) {
    console.error('Error in chat6 endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/chat7', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat7 req', userInput);
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput, "Interviewer");
    res.json({ response });
  } catch (error) {
    console.error('Error in chat7 endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/vision-x', upload.single('image'), async (req, res) => {
  try {
    const filePath = req.file.path;
    console.log('incoming /vision-x req', req.file);

    // Placeholder for actual image analysis logic
    const analysisResult = "Image analysis result here";

    const response = await runChat(analysisResult, "Vision-X");
    res.json({ response });

    // Clean up the uploaded file after processing
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Error in vision-x endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Contact form endpoint
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    console.error('Missing required fields:', { name, email, message });
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Set up email transport
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any email service provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Contact Us Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  // open(`http://localhost:${port}/main_page.html`);
});
