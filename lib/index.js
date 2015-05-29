var yargs = require('yargs')
    .alias('?', 'help')
    .alias('i', 'folder')
    .describe('i', 'folder to be re-organized')
    .alias('o', 'out')
    .describe('o', 'location where to move re-organized files/directories')
    .usage('Usage: $0 -i [folder] -o [out-folder]')
    .default({
        help: false,
        o: "out"
    });
var argv = yargs.argv;
if (argv.help) {
    yargs.showHelp();
    return;
}
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var moment = require('moment');



function moveInDirByCreationDate(dir, file, callback){
	var fileStat = fs.statSync(file);
	var m = moment(fileStat.ctime);
	var year = m.format('YYYY');
	var month = m.format('MM');
	var d =  path.join(dir, year, month);
	var toFile =  path.join(d, path.basename(file));
	console.log('Making dir: ' + d);
	if(fs.existsSync(d)){
		copyFile(file,  toFile,  callback);
	}else{
		mkdirp(d , function(err){
			console.log(err);
			copyFile(file,  toFile,  callback);
		});
	}
}
function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}


var cb = function(err, file, c){
	moveInDirByCreationDate(argv.out, file, c );
};
var f = function(err){

	console.log("All Done!!!");
};
cb( undefined, '/home/matthew/.tmux.conf', f);

