const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-Memory Database Array acting as our Data Layer
let brews = [
  { id: 1, roaster: "Father Coffee", beanOrigin: "Ethiopia", brewMethod: "V60", notes: "Bright and fruity flavor profile." }
];
let nextId = 2;

// VALIDATION MIDDLEWARE (Requirement: Check for blank fields)
const validateBrew = (req, res, next) => {
  const { roaster, beanOrigin, brewMethod } = req.body;
  if (!roaster || !beanOrigin || !brewMethod || roaster.trim() === "" || beanOrigin.trim() === "") {
    return res.status(400).json({ error: "All required fields must be supplied." });
  }
  next();
};

// 1. CREATE (POST endpoint)
app.post('/api/brews', validateBrew, (req, res) => {
  const newBrew = { id: nextId++, ...req.body };
  brews.push(newBrew);
  res.status(201).json(newBrew);
});

// 2. READ & FILTER (GET endpoint)
app.get('/api/brews', (req, res) => {
  const { method } = req.query;
  if (method) {
    const filtered = brews.filter(b => b.brewMethod.toLowerCase() === method.toLowerCase());
    return res.json(filtered);
  }
  res.json(brews);
});

// 3. UPDATE (PUT endpoint)
app.put('/api/brews/:id', validateBrew, (req, res) => {
  const id = parseInt(req.params.id);
  const index = brews.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ error: "Brew entry not found" });
  
  brews[index] = { id, ...req.body };
  res.json(brews[index]);
});

// 4. DELETE (DELETE endpoint)
app.delete('/api/brews/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = brews.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ error: "Brew entry not found" });
  
  brews.splice(index, 1);
  res.status(204).send();
});

// Use environment variables for port selection (Requirement: Security Hygiene)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
