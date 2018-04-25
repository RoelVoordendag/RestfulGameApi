var express = require('express'),
    app = express(),
    mongoose = require('mongoose');
    bodyParser = require('body-parser');
    
//making mongoose
var db = mongoose.connect('mongodb://localhost/gameAPI');

//require the scheme of the restful
var Game = require('./models/gameModel');

// var port = process.env.port;
var port = 8000;

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());
//checking if the content type is application/json otherwise an error
app.use('*', function(req,res,next){  
    if(!req.accepts('application/json')){
        res.status(400).send('Format is not good')
    }else{
        next(); 
    }
});
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

gameRouter = require('./Routes/gameRoutes')(Game);

app.use('/api/games', gameRouter);

app.get('/', function(req,res){
    res.send('welcom to the best api');
});

app.listen(port, function(){
    console.log('working on port: ' +  port);
})

module.exports =app;
