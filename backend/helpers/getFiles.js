const fs = require('fs')
const path = require('path')

function getFiles(req,UPLOAD_DIR,res) {
    fs.promises.readdir(UPLOAD_DIR, {withFileTypes:true})
        .then((entries) => Promise.all(entries
            .filter((entry) => entry.isFile())
            .map(async (entry) => {
                try {
                    const stat = await fs.promises.stat(path.join(UPLOAD_DIR, entry.name))
                    return {name:entry.name, created:stat.birthtimeMs || stat.mtimeMs}
                } catch (error) {
                    console.log(error)
                    return null
                }
            }))
        )
        .then((files) => {
            files = files.filter(Boolean)
            files.sort((a,b) => b.created - a.created)
            return res.json(files.map((file) => file.name))
        })
        .catch((error) => {
            if (error.code === 'ENOENT') {
                return res.sendStatus(404)
            }
            console.log(error)
            return res.sendStatus(500)
        })
}

module.exports = getFiles
