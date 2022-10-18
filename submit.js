const path = require('path');
const _dirname = path.resolve();

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
const TelegramBot = require('node-telegram-bot-api');

const token = '5472542215:AAE3BTVnkJMvnnAuDfN9p90-9a1Vw711PxY';
const bot = new TelegramBot(token, {polling: true});


var serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

var express = require('express');
const request = require("request");

app = express();

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname)))

app.get('/',function(req,res){
    res.sendFile(__dirname + '/home.html')
})

app.get('/about',function(req,res){
    res.sendFile(__dirname + '/about.html')
})

app.get('/register',function(req,res){
    res.sendFile(__dirname + '/register.html')
})

app.get('/registersubmit',function(req,res){
    db.collection('students').add({
        name : req.query.name,
        username : req.query.username,
        pass : req.query.pass,
        email : req.query.email
    });

    res.sendFile(__dirname + '/login.html');

})


app.get('/findmeaning',function(req,res){

    const word = req.query.word;
    request("https://api.dictionaryapi.dev/api/v2/entries/en/"+word,
        function (error, response, body) {
            
        console.log(body);
            
        if(JSON.parse(body).title != null){
            res.send("sorry...no word found!!!");
        }
        else{

            /*res.render('meaningpage', {
                word : JSON.parse(body)[0].word,
                partOfSpeech : JSON.parse(body)[0].meanings[0].partOfSpeech,
                definition : JSON.parse(body)[0].meanings[0].definitions[0].definition,
                });
            res.sendFile(__dirname + '/meaningpage.ejs');   */


            res.write('<body style="background-color: skyblue;background-image: linear-gradient(45deg,#531de9,#8078f7)" >')
            res.write('<center>');
            res.write('<h1>'+JSON.parse(body)[0].word+'</h1>');
            res.write('<h2> PARTS OF SPEECH - '+JSON.parse(body)[0].meanings[0].partOfSpeech+'</h2>');
            res.write('<h2> DEFINITION - '+JSON.parse(body)[0].meanings[0].definitions[0].definition+'</h2>');
            res.write('</center>');
            res.write('</body>');
            }
    })
    

   
})

app.get('/login',function(req,res){
    res.sendFile(__dirname + '/login.html')
})

app.post('/loginsubmit',function(req,res){
    
    var usname =  req.query.name;
    var password = req.query.pass;

    db.collection("students").get().then(function(docs){
        var flag = 0;
        docs.forEach((doc) => {
            if((usname==doc.data().username) && (password==doc.data().pass)){
                flag = 1;
            }
            
            
          console.log(flag);
        });
        if(flag==1){
            res.sendFile(__dirname + '/find.html');
        }
        else{
            res.send("Incorrect credentials.Login failed...");
        }
  })

})

app.listen(3000);