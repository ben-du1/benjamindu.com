function reorderPosts(db, ids, res) {
    if (!Array.isArray(ids) || ids.length === 0 || ids.some((id) => !Number.isInteger(Number(id)))) {
        return res.sendStatus(400)
    }

    db.serialize(() => {
        db.run("BEGIN TRANSACTION", (beginError) => {
            if (beginError) {
                console.log(beginError)
                return res.sendStatus(500)
            }

            const stmt = db.prepare("UPDATE posts SET display_order=? WHERE id=?")
            ids.forEach((id, index) => {
                stmt.run(index, Number(id))
            })

            stmt.finalize((finalizeError) => {
                if (finalizeError) {
                    console.log(finalizeError)
                    return db.run("ROLLBACK", () => res.sendStatus(500))
                }

                db.run("COMMIT", (commitError) => {
                    if (commitError) {
                        console.log(commitError)
                        return res.sendStatus(500)
                    }
                    return res.sendStatus(200)
                })
            })
        })
    })
}

module.exports = reorderPosts
