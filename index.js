const express = require('express');
const fs = require('fs');
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3001;
const jsonParser = bodyParser.json();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

app.get("/", function(req, res){
    const content = fs.readFileSync("data.json", "utf8");
    res.send(content);
});

app.get("/log", function(req, res){
      
    const content = fs.readFileSync("server.log", "utf8");

    res.send(content);
});

app.post("/", jsonParser, function (req, res) {
     
    if (!req.body || !req.body.data || !req.body.data.score) {
        return res.sendStatus(400);
    }
    
    const data = fs.readFileSync('data.json', 'utf8');
    const score = JSON.parse(data);
    const curScore = req.body;

    
    
    const username = (!curScore.data.username || curScore.data.username === '') ? 'Unknown Hero' : curScore.data.username;
    const email = (!curScore.data.email || curScore.data.email === '') ? 'Unknown' : curScore.data.email;
    const userScore = curScore.data.score;
    const currentScore = {
        username: username,
        email: email,
        score: userScore,
    }
    score.push(currentScore);
    fs.writeFileSync('data.json', JSON.stringify(score));

    res.send(JSON.stringify(score));
});

app.delete("/", function(req, res){
    fs.writeFileSync("data.json", JSON.stringify([]));
    res.send('Deleting all data')
});

app.listen(PORT, (err) => {
    if (err) {
        return console.error(err);
    }
    console.log(`Server is listening on ${PORT}`);  
})