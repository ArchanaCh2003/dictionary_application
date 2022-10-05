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

app = express();


app.get('/register',function(req,res){
    res.sendFile(__dirname + '/register.html')
})

app.get('/registersubmit',function(req,res){
    db.collection('students').add({
        name : req.query.name,
        username : req.query.username,
        pass : req.query.pass,
        email : req.query.email
    })
})


app.get('/findmeaning',function(req,res){

    bot.on('message', function(mg){
        request('https://api.dictionaryapi.dev/api/v2/entries/en/'+(mg.text).toLowerCase(), function (error, response, body) {
            console.log(mg);
            console.log(body);
            
            if(JSON.parse(body).title != null){
                bot.sendMessage(mg.chat.id,JSON.parse(body).title)
            }
            else{

                res.render("meaningpage", {
                    word: JSON.parse(body)[0].word,
                    partOfSpeech: JSON.parse(body)[0].meanings[0].partOfSpeech,
                    definition: JSON.parse(body)[0].meanings[0].definitions[0].definition,
                  });

            }
    })
    });

    res.send(__dirname + '/meaningpage.ejs');
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
            if(flag==1){
                res.sendFile(__dirname + '/find.html');
            }
            else{
                res.send("Incorrect credentials.Login failed...");
            }
            
          console.log(flag);
        });
  })

})

app.listen(3000);