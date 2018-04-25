var gameController = function(Game){

    var post =
        function(req,res){
            var game = new Game(req.body);
            //checking if spaces are filled in with mongoose 
            game.save(function(error){
                if(req.body.title && req.body.creater && req.body.genre){
                    game.save();
                    res.status(201).send(game);  
                }else{
                        res.status(400).send({
                        error :  "fill in fields"
                    })   
                }
            })
        }
    //variable pagination
        var total;
        var start;
        var limit;
    var getAll =

    
        function(req,res){
            var query = {};

            //getting value of header start
            if(req.query.start != undefined){
                start = parseInt(req.query.start);
                console.log("start: "+start);
            } else { 
                start = undefined 
            }
            //getting value of header limit
            if(req.query.limit != undefined){
                limit =  parseInt(req.query.limit);
                console.log("limit: "+limit);
            } else {
                //if nothing is filled in the value is undifined
                 limit = undefined 
                }
            //query search
            if(req.query.genre){
                query.genre = req.query.genre;
            }
            
            //Total count of items
            Game.find(query, function(err, games){
                total = games.length;
                console.log("complete total: " + total);

                return total;
            });
            
            //results on searc
            Game.find(query, function(err,games){
                //pagination functions
                                       
                    //counting the current items from get
                    function currentItems (total,start,limit){                     
                        if(limit === undefined){
                            return total;
                        }else{
                            total = returnGame.length / limit;
                            total = Math.ceil(total);                                
                        }
                        return total;
                    }
                    //calculating the pages that are aviable
                    function numberOfPages(total,start,limit){
                        if(limit){
                            total = total / limit;
                            total = Math.ceil(total);                           
                        }else{
                            total = 1
                        }
                        return total; 
                    }
                    //first of page of pagination
                    function getFirstQueryString(total,start,limit){
                        //checking if values are empty/undifined/existing
                        if(limit){
                            total  = "?start=" + 1 + "&limit=" + limit;

                            return total;
                        }else{
                            total = "";

                            return total;
                        }

                    }
                    //getting last page
                    function getLastQueryString(total,start,limit){
                        //calculating the amound the api has to sip for last pagek
                        skip = total - limit + 1;
                        if(limit){
                            total = "?start=" + skip + "&limit=" + limit;

                            return total;
                        }else{
                            total = "";

                            return total;
                        }
                    }
                    function getCurrentPage(total,start,limit){
                        if(limit === undefined || start === undefined){
                            total = 1;
                            return total;
                        }else{
                            total = Math.ceil(start/limit + 1);
                            
                            return total;
                        }

                    }
                    //getting next page
                    function getNextString(total,start,limit){
                       
                        if(limit === undefined || start === undefined || start >= total){
                            total = "";
                            
                            return total;
                         
                        }else{

                            skip = start + limit;

                            if(skip >=5){
                                total = ""
                            }else{
                                total = "?start=" + skip + "&limit=" + limit;                                
                            }
                            return total;
                        }
                    }
                    function getPreviousString(total,start,limit){
                        if(limit === undefined || start === undefined  ){
                            total = "";
                            
                            return total;
                         
                        }else{

                            skip = start - limit;
                            if (skip <= 0){
                                total =  "";
                            }else{
                                total = "?start=" + skip + "&limit=" + limit;
                            }                            
                            return total;
                        }
                    }

                    if(err){
                        res.status(500).send(err);
                    }else{
                        var returnGame = [];
                        games.forEach(function(element,index,array){
                            var newGame = element.toJSON();

                            newGame._links ={};
                            newGame._links.self= {};
                            //self linf and under link to collection
                            newGame._links.self.href = 'http://' + req.headers.host + '/api/games/' + newGame._id;
                            
                            
                            returnGame.push(newGame);                        
                            
                        });
                    }
            
                                
                    res.json({
                            items : returnGame,
                            _links :{
                                self :{
                                    href : 
                                    'http://' + req.headers.host + '/api/games/'
                                }                                                                                                                                                                       
                            },
                            pagination :{
                                currentPage : getCurrentPage(total,start,limit),
                                currentItems: currentItems(total,start,limit),
                                totalPages : numberOfPages(total,start,limit),
                                totalItems: total,
                                _links  : {
                                    first:{
                                        page :  1,
                                        href : "http://127.0.0.1:8000/api/games/"  + getFirstQueryString(total, start,limit)
                                        
                                    },
                                    last: {
                                        page:   numberOfPages(total,start,limit),
                                        href:  "http://127.0.0.1:8000/api/games/"  + getLastQueryString(total, start,limit)
                                    },
                                    previous:{
                                        page: getCurrentPage(total,start,limit) - 1,
                                        href:  "http://127.0.0.1:8000/api/games/"  + getPreviousString(total, start,limit)
                                    },
                                    next:{
                                        page : getCurrentPage(total,start,limit) + 1,
                                        href : "http://127.0.0.1:8000/api/games/"  + getNextString(total, start,limit)
                            
                                    }


                                }
                            }
                        });
                    }).skip(start).limit(limit);
                }
    
  
        
        
    var getID =
            function(req,res){
                var newGame = req.game.toJSON();
                //creating links
                newGame._links ={};
                newGame._links.self= {};
                newGame._links.collection ={};
                //self linf and under link to collection
                newGame._links.self.href = 'http://' + req.headers.host + '/api/games/' + newGame._id;
                newGame._links.collection.href = 'http://' + req.headers.host + '/api/games';

                res.json(newGame);
            }
    var putID = 
            function(req,res){
                if(!req.body.title || !req.body.creater || !req.body.genre){
                    res.status(400).send('fields are not filled in');
                }else{
                    
                        req.game.title = req.body.title;
                        req.game.genre = req.body.genre;
                        req.game.creater = req.body.creater;
                        console.log(req.game);

                        req.game.save();

                        res.json(req.game).status(200);
           
                }
            }
    var patchID =
        
        function(req, res){
            if(req.body._id)
            {
                delete req.body._id;
            }
            
            for(var i in req.body)
            {
                req.game[i] = req.body[i];
            }

            req.game.save(function(err)
            {
                if(err){
                    res.status(500).send(err);
                }else{
                    res.json(req.game);
                }
            });
        }


     //deleting id
    var deleteID =
            function(req,res, err){
                req.game.remove(function(err){
                    if(err){
                        //if remove not work
                        res.status(500).send(err);
                    }else{
                        res.status(204).send('removed this game');
                    }
                });
            }
    //all the options for this collection
    var collectionOptions = function(req,res){
        res.header('Allow', 'GET,POST,OPTIONS');
        res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.sendStatus(200);
    }
    //all the options for getting a single id
    var singleOptions = function(req,res){
        res.header('Allow', 'GET,PUT,PATCH,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,DELETE,OPTIONS');
        res.sendStatus(200);
    }
    return{
        getAll:getAll,
        post:post,
        deleteID:deleteID,
        getID:getID,
        putID:putID,
        patchID:patchID,
        collectionOptions:collectionOptions,
        singleOptions:singleOptions
    }
    
}

module.exports = gameController;