const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
let currentId = 1;
app.use(express.json());

const users = [];

app.post('/register', async (req, res) => {
    const {email, password, name} = req.body;
    const user = users.find(r => r.email === email);

    if (!email || !password)
        return res.status(400).json({"error": "Email and password required"});
    if (user)
        return res.status(409).json({"error": "User already exists"});
    const passwordHash = await bcrypt.hash(password, 10);
    const newuser = {
        id: currentId,
        email: email,
        password: passwordHash,
        ...(name  ? { name } : {})
    }
    currentId++;
    users.push(newuser);
    const token = jwt.sign(
        {sub: newuser.id },
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
    )

    return res.status(200).json({"message": "created user", newuser, token});
})


app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = users.find(r => r.email === email);
    if (!email || !password)
        return res.status(400).json({"error": "Email and password required"});
    if (!user)
        return res.status(404).json({"error": "Email is not registered"});
    const passwordHash = await bcrypt.hash(password, 10)
    if (passwordHash != user.password)
        return res.status(401).json({"error": "Incorrect password"});
    const token = jwt.sign (
        {sub: user.id},
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
    )
    return res.status(200).json({"message": "Sucessful login", user, token});
})

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Auth listening on ${PORT}`));
