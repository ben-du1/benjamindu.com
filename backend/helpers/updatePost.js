function slugify(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'post'
}

function updatePost(db, id, title,description,date,content,image,requestedSlug,category,res) {
    const slug = slugify(requestedSlug || title)
    const postCategory = category === 'fun' ? 'fun' : 'serious'

    db.serialize(() => {
        db.all("SELECT id,slug,title FROM posts WHERE id<>?", id, (lookupError, posts) => {
            if (lookupError) {
                console.log(lookupError)
                return res.sendStatus(500)
            }

            if ((posts || []).some((post) => (post.slug || slugify(post.title)) === slug)) {
                return res.status(409).send('Slug is already in use')
            }

            const stmt = db.prepare("UPDATE posts SET title=?, description=?, date=?, content=?, image=?, slug=?, category=? WHERE id=?")
            stmt.run(title,description,date,content,image,slug,postCategory,id,(err) => {
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
    })
}

module.exports = updatePost