function slugify(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'post'
}

function createPost(db, title,description,date,content,image,res) {
    const slug = slugify(title)

    db.serialize(() => {
        db.get("SELECT COALESCE(MIN(display_order), 0) - 1 AS next_order FROM posts", (orderError, row) => {
            if (orderError) {
                console.log(orderError)
                return res.sendStatus(500)
            }

            const stmt = db.prepare("INSERT INTO posts (title,description,date,content,image,slug,display_order) VALUES (?,?,?,?,?,?,?)")
            stmt.run(title,description,date,content,image,slug,row.next_order,(err) => {
                if (err) {
                    console.log(err)
                    return res.sendStatus(500)
                }
            })

            stmt.finalize()
            return res.send(200)
        })
    })
}

module.exports = createPost