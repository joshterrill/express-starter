module.exports = function(app) {
	app.get('/', function(req, res) {  
	    res.render('home');
	});

	app.get("/testing/:number", function(req, res) {
	    var number = req.params.number;
	    res.json({testing: number});
	});
}