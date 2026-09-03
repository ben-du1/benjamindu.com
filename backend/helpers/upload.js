const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const {authCheck} = require('./auth.js')
const {getSafeFileName} = require('./mediaPath.js')

function upload(req,UPLOAD_DIR,PASSWORD_KEY,res) {
    const form = new formidable.IncomingForm({
        multiples:false,
        keepExtensions:true
    })

    form.parse(req,(err,fields,files) => {
        if (err) {
            console.log(err)
            return res.sendStatus(400)
        }

        const passwordField = fields && fields.password
        const password = Array.isArray(passwordField) ? passwordField[0] : passwordField
        if (!authCheck(password,PASSWORD_KEY,res)) return

        const fileField = files && files.file
        if (Array.isArray(fileField) && fileField.length !== 1) {
            return res.sendStatus(400)
        }
        const uploadValue = Array.isArray(fileField) ? fileField[0] : fileField
        if (!uploadValue || typeof uploadValue.filepath !== 'string' ||
            typeof uploadValue.originalFilename !== 'string' ||
            !uploadValue.originalFilename) {
            return res.sendStatus(400)
        }

        const originalFilename = uploadValue.originalFilename
        const safeFilename = getSafeFileName(originalFilename)
        if (!safeFilename || safeFilename !== originalFilename ||
            safeFilename === '.' || safeFilename === '..' || safeFilename.includes('\0')) {
            return res.sendStatus(400)
        }

        const newFilePath = path.join(UPLOAD_DIR, `${crypto.randomUUID()}-${safeFilename}`)
        fs.rename(uploadValue.filepath,newFilePath,(renameError) => {
            if (renameError) {
                console.log(renameError)
                return res.sendStatus(500)
            }
            return res.sendStatus(200)
        })
    })
}

module.exports = upload
