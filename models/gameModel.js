var mongoose = require('mongoose'),
    schema = mongoose.Schema;

var gameModel = new schema({
    title:{
        type: String 
    },
    genre:{
        type:String 
    },
    creater:{
        type:String
    }
});

module.exports = mongoose.model('Game', gameModel);