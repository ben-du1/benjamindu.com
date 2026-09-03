function slugify(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'post'
}

function withSlug(row) {
    return {
        ...row,
        slug: row.slug || slugify(row.title)
    }
}

function getPost(db, identifier, res) {
    const value = String(identifier ?? '').trim()

    const sendOne = (row) => {
        if (!row) {
            return res.sendStatus(404)
        }
        return res.json(withSlug(row))
    }

    if (value && value !== '-1') {
        const query = /^\d+$/.test(value)
            ? 'SELECT * FROM posts WHERE id=?'
            : 'SELECT * FROM posts WHERE slug=?'
        return db.get(query, value, (err, row) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }
            if (row) {
                return sendOne(row)
            }

            // Older rows may not have a stored slug.
            return db.all('SELECT * FROM posts ORDER BY display_order ASC, id ASC', (allError, rows) => {
                if (allError) {
                    console.log(allError)
                    return res.sendStatus(500)
                }
                const match = (rows || []).map(withSlug).find((post) => slugify(post.title) === value)
                return sendOne(match)
            })
        })
    }

    return db.all('SELECT * FROM posts ORDER BY display_order ASC, id ASC', (err, rows) => {
        if (err) {
            console.log(err)
            return res.sendStatus(500)
        }
        return res.json((rows || []).map(withSlug))
    })
}

module.exports = getPost