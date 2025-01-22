const express = require('express');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

const USERNAME = "admin";
const PASSWORD = "password";

const SECRET_KEY = process.env.SECRET || '';

// login API 
// Request body should contain username and password
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === USERNAME && password === PASSWORD) {
    const token = jwt.sign(
      { username },
      SECRET_KEY,
    );

    return res.status(200).json({ token });
  } else if (username === "" && password === "") {
    return res.status(401).json({ error: "Please enter username and password" });
  } else {
    return res.status(401).json({ error: "Invalid username or password" });
  }
});

// protected API
// Request header should contain Authorization with Bearer token
app.get('/protected', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Missing token" });
  }
  else if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid authentication" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return res.status(200).json({ message: `Welcome, ${decoded.username}!` });
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
});

// Start the server on port 3000 and log a message to the console
app.listen(3000, () => console.log('API running on port 3000'));