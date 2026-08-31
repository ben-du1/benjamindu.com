const fs = require('fs')

function getFiles(req,UPLOAD_DIR,res) {
    fs.readdir(UPLOAD_DIR,(err,files) => {
        if (err) {
            return res.sendStatus(404)
        }
        files.sort( (a,b) => {
            return fs.statSync(UPLOAD_DIR+'/'+a).birthtimeMs - fs.statSync(UPLOAD_DIR+'/'+b).birthtimeMs
        }).reverse()

        return res.send(JSON.stringify(files))
    })
}

module.exports = getFiles