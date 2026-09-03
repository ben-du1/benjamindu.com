const fs = require('fs')
const {resolveMediaPath} = require('./mediaPath.js')

function deleteFile(fileName,UPLOAD_DIR,res) {
    resolveMediaPath(fileName, UPLOAD_DIR)
        .then((filePath) => {
            if (!filePath) {
                return res.sendStatus(404)
            }
            return fs.promises.unlink(filePath)
                .then(() => res.sendStatus(200))
        })
        .catch((error) => {
            if (error.code === 'ENOENT') {
                return res.sendStatus(404)
            }
            console.log(error)
            return res.sendStatus(500)
        })
}

module.exports = deleteFile
