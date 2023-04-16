const express = require('express');
const app = express();
const port = 4000;
const mysql = require('mysql2/promise');
const signIn = require('./controllers/signIn');
const collection = require('./controllers/collection');
const getAmiibo = require('./controllers/getAmiibo');
const getMostCollected = require('./controllers/getMostCollected');
const getLeastCollected = require('./controllers/getLeastCollected');

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

app.post('/collection', (req, res) => {collection.handleCollect(req, res, pool)});

app.get('/amiibo/:email', (req, res,) => {getAmiibo.handleGetAmiibo(req, res, pool)});

app.get('/amiibo/mostCollected/:amount', (req, res) => { getMostCollected.handleGetMostCollected(req, res, pool)});

app.get('/amiibo/leastCollected/:amount', (req, res) => { getLeastCollected.handleGetLeastCollected(req, res, pool)});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})