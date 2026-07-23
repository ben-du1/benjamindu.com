function getPost(db,id,res) {
    db.serialize(() => {

        if (id != -1) {
            const stmt = db.prepare("SELECT * FROM posts WHERE id=?",id)
            stmt.all((err,rows) => {
                if (err || !rows[0]) {
                    console.log(err)
                    return res.send(404)
                } else {
                    return res.send(JSON.stringify(rows[0]))
                }
        })

        stmt.finalize()
        } else {
            const stmt = db.prepare("SELECT * FROM posts")
            stmt.all((err,rows) => {
                if (err || !rows[0]) {
                    console.log(err)
                    return res.send(404)
                } else {
                    return res.send(JSON.stringify(rows))
                }
            })
        }
    })
}

module.exports = getPost