const express = require('express');
const app = express();
const port = 4000;
const mysql = require('mysql2/promise');
const signIn = require('./controllers/signIn');
const collectAmiibo = require('./controllers/collectAmiibo');

require('dotenv').config();

app.use(express.json());

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'the-amiibo-library'
});

pool.query('SELECT 1 + 1 AS solution')
    .then(([rows, fields]) => console.log(rows));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/signIn', (req, res) => {signIn.handleSignIn(req, res, pool)});

app.post('/collectAmiibo', (req, res) => {collectAmiibo.handleCollect(req, res, pool)});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})