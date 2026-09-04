function deletePost(db, id,res) {
    db.serialize(() => {
        const stmt = db.prepare("DELETE FROM posts WHERE id=?")
        stmt.run(id,(err) => {
            if (err) {
                console.log(err)
                return stmt.finalize(() => res.sendStatus(500))
            }
            stmt.finalize((finalizeError) => {
                if (finalizeError) {
                    console.log(finalizeError)
                    return res.sendStatus(500)
                }
                return res.sendStatus(200)
            })
        })
    })
}

module.exports = deletePost