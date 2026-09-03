const {resolveMediaPath} = require('./mediaPath.js')

function serveFile(req,UPLOAD_DIR,res) {
    resolveMediaPath(req.params.name, UPLOAD_DIR)
        .then((filePath) => {
            if (!filePath) {
                return res.sendStatus(404)
            }
            return res.sendFile(filePath)
        })
        .catch((error) => {
            console.log(error)
            return res.sendStatus(500)
        })
}

module.exports = serveFile
