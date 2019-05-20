// rum 'npm install' on subfolder which has a package.json on it


var fs = require('fs')
var resolve = require('path').resolve
var join = require('path').join
var cp = require('child_process')
var os = require('os')

// get library path
var lib = resolve(__dirname, './functions/')
var dist = resolve(__dirname, './dist/')

fs.readdirSync(lib)
  .forEach(function (mod) {
    var modPath = join(lib, mod)
// ensure path has package.json
if (!fs.existsSync(join(modPath, 'package.json'))) return

// install folder
cp.spawn('zip', ['-r',dist+'/'+mod,'.'], { env: process.env, cwd: modPath, stdio: 'inherit' })
})