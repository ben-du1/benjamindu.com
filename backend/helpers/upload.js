const formidable = require('formidable')
const fs = require('fs')

const {authCheck} = require('./auth.js')
 
function upload(req,UPLOAD_DIR,PASSWORD_KEY,res) {
    const form = new formidable.IncomingForm({})

        form.parse(req,(err,fields,files) => {

            if (!authCheck(fields.password[0],PASSWORD_KEY,res)) return res.sendStatus(404);

            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }

            const randomPrefix = Math.floor(Math.random() * (99999-10000 + 1)) + 10000

            const uploadMedia = files.file[0]
            const newFilePath = UPLOAD_DIR + '/' + randomPrefix + uploadMedia.originalFilename
            fs.rename(uploadMedia.filepath,newFilePath,(err) => {
                if (err) {
                    console.log(err)
                    return res.sendStatus(500)
                }
                return res.send(200)
            })
        })
}

module.exports = upload