function slugify(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'post'
}

function updatePost(db, id, title,description,date,content,image,requestedSlug,res) {
    const slug = slugify(requestedSlug || title)

    db.serialize(() => {
        db.get("SELECT id FROM posts WHERE slug=? AND id<>?", slug, id, (lookupError, existingPost) => {
            if (lookupError) {
                console.log(lookupError)
                return res.sendStatus(500)
            }

            if (existingPost) {
                return res.status(409).send('Slug is already in use')
            }

            const stmt = db.prepare("UPDATE posts SET title=?, description=?, date=?, content=?, image=?, slug=? WHERE id=?")
            stmt.run(title,description,date,content,image,slug,id,(err) => {
                if (err) {
                    console.log(err)
                    return res.sendStatus(500)
                }
                return res.sendStatus(200)
            })
            stmt.finalize()
        })
    })
}

module.exports = updatePost