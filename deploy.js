// rum 'npm install' on subfolder which has a package.json on it

let apiData = require('./api.json');
var fs = require('fs')
var resolve = require('path').resolve
var join = require('path').join
var cp = require('child_process')
var os = require('os')
const async = require('async');


// get library path
var lib = resolve(__dirname, './dist/')


let f = process.argv[2]

let iter = []
if (f) {
	iter = [f] 
} else {
	iter = fs.readdirSync(lib)
}



async.eachSeries(iter,(mod, next) => {
	var modPath = join(lib, mod)
	console.log("Uploading: "+mod)
	const fileName = mod.split('.').slice(0, -1).join('.')
	// const attr = [
	// 	'lambda',
	// 	'create-function',
	// 	'--function-name',
	// 	apiData.api+'-'+fileName,
	// 	'--zip-file',
	// 	'fileb://'+modPath,
	// 	'--handler',
	// 	'index.handler',
	// 	'--runtime',
	// 	'nodejs8.10',
	// 	'--role',
	// 	'arn:aws:iam::116588259147:role/shepRole'
	// ]
	const attr = [
		'lambda',
		'update-function-code',
		'--function-name',
		apiData.api+'-'+fileName,
		'--zip-file',
		'fileb://'+modPath
	]
	let upload = cp.spawn('aws', attr, { env: process.env, stdio: 'inherit' })
	upload.on('exit', () => { 
		console.log('Done');
		next()
	});
	
});