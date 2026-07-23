function deletePost(db, id,res) {
    db.serialize(() => {
        const stmt = db.prepare("DELETE FROM posts WHERE id=?")
        stmt.run(id)
        stmt.finalize()
        return res.send(200)
    })
}

module.exports = deletePost