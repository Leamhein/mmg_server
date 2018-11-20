const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const fs = require('fs');
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3001;
const jsonParser = bodyParser.json();

const uri = "mongodb+srv://Uladzimir:211989206@cluster0-8fxtg.gcp.mongodb.net/test?retryWrites=true";
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

app.get("/", function(req, res) {
    MongoClient.connect(uri, (err, client) => {
        assert.equal(null, err);
        client.db('reactMMG').collection('score').find({}).toArray((err, score) => {
            res.send(score);
            client.close();
        });
    });
});

app.get("/log", function(req, res) {
    const content = fs.readFileSync("server.log", "utf8");

    res.send(content);
});

app.post("/", jsonParser, function (req, res) {
    
    if (!req.body || !req.body.data || !req.body.data.score) {
        return res.sendStatus(400);
    }
    const curScore = req.body;
    const username = (!curScore.data.username || curScore.data.username === '') ? 'Unknown Hero' : curScore.data.username;
    const email = (!curScore.data.email || curScore.data.email === '') ? 'Unknown' : curScore.data.email;
    const userScore = curScore.data.score;
    const currentScore = {
        username: username,
        email: email,
        score: userScore,
    }
    MongoClient.connect(uri, (err, client) => {
        assert.equal(null, err);
        client.db('reactMMG').collection('score').insertOne(currentScore)
        .then(function(result) {
            res.send('Data added');
        });
    });
});

app.delete("/", function(req, res){
    MongoClient.connect(uri, (err, client) => {
        assert.equal(null, err);
        client.db('reactMMG').collection('score').deleteMany({})
        .then(function(result) {
            res.send('Data deleted');
        });
    });
});

app.listen(PORT, (err) => {
    if (err) {
        return console.error(err);
    }
    console.log(`Server is listening on ${PORT}`);  
})