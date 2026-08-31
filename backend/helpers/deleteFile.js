const fs = require('fs')

function deleteFile(fileName,UPLOAD_DIR,res) {
    fs.unlink(UPLOAD_DIR+'/'+fileName,(err) => {
        if (err) return res.send(404)
        else return res.send(200)
    })
}

module.exports = deleteFile