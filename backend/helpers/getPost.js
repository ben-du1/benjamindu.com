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
    db.serialize(() => {
        db.all('SELECT * FROM posts ORDER BY display_order ASC, id ASC', (err, rows) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }

            if (!rows || rows.length === 0) {
                return res.sendStatus(404)
            }

            const normalizedRows = rows.map(withSlug)
            const value = String(identifier ?? '').trim()

            if (!value || value === '-1') {
                return res.send(JSON.stringify(normalizedRows))
            }

            const match = normalizedRows.find((row) => {
                if (/^\d+$/.test(value) && Number(row.id) === Number(value)) {
                    return true
                }
                return row.slug === value || slugify(row.title) === value
            })

            if (!match) {
                return res.sendStatus(404)
            }

            return res.send(JSON.stringify(match))
        })
    })
}

module.exports = getPost