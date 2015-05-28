var fs = require('fs');

var o = fs.stat('/home/matthew/.tinputrc', function(err, f){
	console.log(f);
});
