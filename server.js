const express = require('express');
const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome to my domain')
})

app.get('/status', (req, res) => {
    res.json({status: "operational", timestamp: new Date().toISOString()})
})

app.get('/user/:name', (req, res) => {
    const name = req.params.name
    res.json({message: `Hello, ${name}`, timestamp: new Date().toISOString()})
})

app.get('/search', (req, res) => {
  const q = req.query.q;

  if (!q) {
    return res.status(400).json({ error: 'Missing query parameter q' });
  }

  res.json({ query: q, timestamp: new Date().toISOString() });
});

app.post('/recipes', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    if (!title || !description)
        return res.status(400).json({"error": "Title and description are required"})
    return res.status(201).json({message: "Recipe created", recipe:{ title: `${title}`, description: `${description}`}})

})
app.listen(3000)