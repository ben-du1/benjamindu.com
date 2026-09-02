const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const cors = require('cors')
const path = require('path')
const http = require('http')
const https = require("https")
const fs = require('fs')

const db = new sqlite3.Database('benjamindu.sql')
const HTTP_PORT = 4000
const HTTPS_PORT = 443
const UPLOAD_DIR = path.join(__dirname+'/media')
const BUILD_DIR = path.join(__dirname+'/build')
const PASSWORD_KEY = "skibidi"
const USE_HTTPS = false;

const {authInit,authCheck} = require('./helpers/auth.js')
const getPost = require('./helpers/getPost.js')
const createPost = require('./helpers/createPost.js')
const updatePost = require("./helpers/updatePost.js")
const deletePost = require('./helpers/deletePost.js')
const reorderPosts = require('./helpers/reorderPosts.js')
const upload = require('./helpers/upload.js')
const serveFile = require("./helpers/serveFile.js")
const getFiles = require('./helpers/getFiles.js')
const deleteFile = require('./helpers/deleteFile.js')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static(BUILD_DIR))

app.post('/auth',(req,res) => {
    authInit(req.body.password,PASSWORD_KEY,res)
})

app.get('/post/:slug', (req,res) => {
    getPost(db, req.params.slug, res)
})

app.get('/post',(req,res) => {
    getPost(db, req.query.id ?? req.query.slug, res)
})

app.get('/posts',(req,res) => {
    getPost(db,-1,res)
})

app.post('/delete',(req,res) => {
    if (authCheck(req.body.password,PASSWORD_KEY,res)) {
        deletePost(db,req.body.id,res)
    }
})

app.post('/reorderposts',(req,res) => {
    if (authCheck(req.body.password,PASSWORD_KEY,res)) {
        reorderPosts(db, req.body.ids, res)
    }
})

app.post('/createpost',(req,res) => {
    if (authCheck(req.body.password,PASSWORD_KEY,res)) {
        createPost(db,req.body.title,req.body.description,req.body.date,req.body.content,req.body.image,res)
    }
})

app.post('/updatepost',(req,res) => {
    if (authCheck(req.body.password,PASSWORD_KEY,res)) {
        updatePost(db,req.body.id,req.body.title,req.body.description,req.body.date,req.body.content,req.body.image,req.body.slug,res)
    } 
})

app.post('/upload',(req,res) => {
    // auth handled in upload
    upload(req,UPLOAD_DIR,PASSWORD_KEY,res)

})

app.get('/file/:name',(req,res) => {
    serveFile(req,UPLOAD_DIR,res)
})

app.post('/files',(req,res) => {
    if (authCheck(req.body.password,PASSWORD_KEY,res)) {
        getFiles(req,UPLOAD_DIR,res)
    }
    
})

app.post('/deletefile',(req,res) => {
    if (authCheck(req.body.password,PASSWORD_KEY,res)) {
        deleteFile(req.body.fileName,UPLOAD_DIR,res)
    }
})

// ---------------------------------------

// app.get(/.*/, (req,res) => {
//     res.sendFile(BUILD_DIR+'/index.html')
// })

if (USE_HTTPS) {
    var privateKey  = fs.readFileSync('/etc/letsencrypt/live/benjamindu.com/privkey.pem', 'utf8');
    var certificate = fs.readFileSync('/etc/letsencrypt/live/benjamindu.com/fullchain.pem', 'utf8');
    var credentials = {key:privateKey, cert:certificate}

    var httpsServer = https.createServer(credentials,app)
    httpsServer.listen(HTTPS_PORT,() => {
        console.log("benjamindu.com-v5 HTTPS server running on port "+HTTPS_PORT)
    })
} else {
    app.listen(HTTP_PORT,() => {
    console.log("benjamindu.com-v5 HTTP server running on port "+HTTP_PORT)
    })
}
