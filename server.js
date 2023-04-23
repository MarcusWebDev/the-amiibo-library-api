const express = require('express');
const cors = require('cors');
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
app.use(cors());

const pool = mysql.createPool({
    connectionLimit: 100,
    host: '127.0.0.1',
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'the_amiibo_library',
    port: 3306
});

app.post('/signIn', (req, res) => {signIn.handleSignIn(req, res, pool)});

app.post('/collection', (req, res) => {collection.handleCollect(req, res, pool)});

app.get('/amiibo/:email', (req, res,) => {getAmiibo.handleGetAmiibo(req, res, pool)});

app.get('/amiibo/mostCollected/:amount', (req, res) => { getMostCollected.handleGetMostCollected(req, res, pool)});

app.get('/amiibo/leastCollected/:amount', (req, res) => { getLeastCollected.handleGetLeastCollected(req, res, pool)});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})