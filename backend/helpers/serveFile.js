

function serveFile(req,UPLOAD_DIR,res) {
    fileName = req.params.name
    if (fileName) {
        return res.sendFile(UPLOAD_DIR+'/'+fileName)
    }
    return res.sendStatus(404)
}

module.exports = serveFile