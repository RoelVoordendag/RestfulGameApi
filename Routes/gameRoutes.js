var express = require('express');

var routes = function(Game)
{
    var gameRouter = express.Router();
    var gameController = require('../controller/gameController')(Game);



    //everything on the route api/games
    gameRouter.route('/')
        .options(gameController.collectionOptions)

        .post(gameController.post)

        .get(gameController.getAll)        

        gameRouter.use('/:gameId', function(req, res, next){
            Game.findById(req.params.gameId, function(err,game){
                if(err){
                    res.status(500).send(err);
                }else if(game){
                    req.game = game;
                    next();
                }else{
                    res.status(404).send('no book found');
                }
            });
        }); 


    gameRouter.route('/:gameId')

        //getting id
        .get(gameController.getID)

        //deleting id
        .delete(gameController.deleteID)

        //editing items
        .put(gameController.putID)

        //patch
        .patch(gameController.patchID)

        .options(gameController.singleOptions)
        
    
    
    return gameRouter;
    

}
//exports routes so it used on other places
module.exports = routes;