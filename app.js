const express = require('express');
const app = express();
const path = require('path')
var cors = require('cors')
var oracledb = require('oracledb');

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.get('/', (req, res) => {
	res.render('index.html');
});

app.get('/search', (req, res) => {
	res.render('search.html');
});

app.get('/search/terms', (req, res) => {
	var term = req.query.term;
	oracledb.getConnection(
	  {
	    user          : "user101",
	    password      : "pass101",
	    connectString : "ec2-52-34-15-188.us-west-2.compute.amazonaws.com:1521/XE"
	  },
	  function(err, connection) {
	    if (err) {
	      console.error(err.message);
	      return;
	    }
	    connection.execute(
	      term,
	        // bind value for :id
	      function(err, result) {
	        if (err) {
	          console.error(err.message);
	          doRelease(connection);
	          return;
	        }
	        console.log(result);

	        res.send(result);

	        doRelease(connection);
	      });
	  });

	function doRelease(connection) {
	  connection.close(
	    function(err) {
	      if (err)
	        console.error(err.message);
	    });
	}
	
});


app.listen(3000, () => {
	console.log("Listening on Port 3000");
});
