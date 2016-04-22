//Routes
module.exports = function(app){
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

    app.get('/rest', function(req, res){
        res.render('rest');
    });

    app.get('/web-sockets', function(req, res){
        res.render('web-sockets');
    })

    //Rest Router Handling
    // restRouter.get('/', function(req, res, next){
    //     res.render('rest', {isRoot:true});
    // });

    // restRouter.get('/:parameter', function(req, res, next){
    //     var regEx = new RegExp(/^\d+(?:\.\d{1,2})?$/);
    //     switch(regEx.test(req.params.parameter)){
    //         case true:
    //             res.render('rest', {
    //                 isNumber: true,
    //                 parameter:req.params.parameter
    //             });
    //             break;
    //         default:
    //             res.render('rest', {
    //                 isNumber: false,
    //                 parameter:req.params.parameter
    //             });
    //     }
    // });
}