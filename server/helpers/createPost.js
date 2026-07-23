function createPost(db, title,description,date,content,image,res) {
    db.serialize(() => {
        const stmt = db.prepare("INSERT INTO posts (title,description,date,content,image) VALUES (?,?,?,?,?)")
        stmt.run(title,description,date,content,image)
        stmt.finalize()
        return res.send(200)
    })
}

module.exports = createPost