function deletePost(db, id,res) {
    db.serialize(() => {
        const stmt = db.prepare("DELETE FROM posts WHERE id=?")
        stmt.run(id,(err) => {

            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }
        })
        stmt.finalize()
        return res.send(200)
    })
}

module.exports = deletePost