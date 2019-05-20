// create lambda for api endpoint

var fs = require('fs')
var resolve = require('path').resolve
var join = require('path').join
var cp = require('child_process')
var os = require('os')
let apiData = require('./api.json');

console.log(process.argv)

let endpoint = process.argv[2]
var lib = resolve(__dirname, './functions/')
var modPath = join(lib, endpoint+'-'+apiData.method)

// create dir
if (!fs.existsSync(modPath)){
    fs.mkdirSync(modPath);
}

// create index.js

indexFile = join(modPath, "index.js")

var data = 
`
exports.handler = async (event) => {

  return "algo"
};
`;

fs.writeFile(indexFile, data, (err) => {
  if (err) console.log(err);
  console.log("Successfully Written to File.");
});

// npm init
cp.spawn('npm', ['init','--yes'], { env: process.env, cwd: modPath, stdio: 'inherit' })


