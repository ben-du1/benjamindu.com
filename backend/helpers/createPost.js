const {serializeKeywords} = require('./keywords.js')

function slugify(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'post'
}

function createPost(db, title,description,date,content,image,category,keywords,res) {
    const slug = slugify(title)
    const postCategory = category === 'fun' ? 'fun' : 'serious'
    const postKeywords = serializeKeywords(keywords)

    db.serialize(() => {
        db.all("SELECT slug,title FROM posts", (slugError, rows) => {
            if (slugError) {
                console.log(slugError)
                return res.sendStatus(500)
            }

            const slugInUse = (rows || []).some((row) =>
                (row.slug || slugify(row.title)) === slug
            )
            if (slugInUse) {
                return res.status(409).send('Slug is already in use')
            }

            db.get("SELECT COALESCE(MIN(display_order), 0) - 1 AS next_order FROM posts", (orderError, row) => {
            if (orderError) {
                console.log(orderError)
                return res.sendStatus(500)
            }

            const stmt = db.prepare("INSERT INTO posts (title,description,date,content,image,slug,display_order,category,keywords) VALUES (?,?,?,?,?,?,?,?,?)")
            stmt.run(title,description,date,content,image,slug,row.next_order,postCategory,postKeywords,(err) => {
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
    })
}

module.exports = createPost
