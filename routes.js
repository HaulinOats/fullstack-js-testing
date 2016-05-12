//Routes
module.exports = function(app){
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host : 'sql5.freemysqlhosting.net',
        user : "sql5119092",
        password: "HfATbFTFpy",
        database: "sql5119092"
    });

    app.get('/', function(req, res){
        res.render('index', {isHome: true});
    });

    app.get('/mobile', function(req, res){
    	res.render('mobile');
    });

    app.get('/angular', function(req, res){
    	res.render('angular');
    });

    app.get('/daynight-animation', function(req, res){
        res.render('daynight');
    });

    app.get('/flappy-turd', function(req, res){
        res.render('flappyTurd');
    });

    app.get('/rebounce', function(req, res){
        res.render('rebounce');
    });

    app.get('/web-sockets', function(req, res){
        res.render('web-sockets');
    })

    //Rest Router Handling
    app.get('/rest', function(req, res){
        res.render('rest');
    });
    app.get('/rest/:string', function(req, res){
        var numCount    = 0,
            letterCount = 0,
            symbolCount = 0;

        //loop through input string and find how many letter, numbers, and symbols are there
        for (var i = 0; i < req.params.string.length; i++){
            if(isNaN(req.params.string[i])) {
                if(req.params.string[i].match(/[a-z]/i))
                    letterCount++;
                else
                    symbolCount++;
            } else
                numCount++;
        }

        res.render('rest2', {"urlParam":req.params.string, "numCount":numCount, "letterCount":letterCount, "symbolCount":symbolCount});
    });

    app.get('/vue-playlist', function(req, res){
        res.render('vue-playlist');
    });

    // var userRouter = express.Router();
    // var itemRouter = express.Router({margeParams: true});
    app.get('/sql-playground', function(req, res){
        connection.query('SELECT * from `users`', function(error, results, fields){
            if(error)
                console.log('error on connection: ', error);
            else{
                console.log('connection successful: ');
                console.log(results);
                res.render('sql-playground', {'users':results});
            }
        });
    });
}