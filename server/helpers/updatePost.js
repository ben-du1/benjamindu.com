function updatePost(db, id, title,description,date,content,image,res) {
    db.serialize(() => {
        const stmt = db.prepare("UPDATE posts SET title=?, description=?, date=?, content=?, image=? WHERE id=?")
        stmt.run(title,description,date,content,image,id)
        stmt.finalize()
        return res.send(200)
    })
}

module.exports = updatePost