function reorderPosts(db, ids, res) {
    if (!Array.isArray(ids) ||
        ids.some((id) => {
            const isIntegerValue = (typeof id === 'number' && Number.isSafeInteger(id)) ||
                (typeof id === 'string' && /^\d+$/.test(id))
            return !isIntegerValue || Number(id) < 1 || !Number.isSafeInteger(Number(id))
        })) {
        return res.sendStatus(400)
    }

    const normalizedIds = ids.map(Number)

    db.all("SELECT id FROM posts", (lookupError, rows) => {
        if (lookupError) {
            console.log(lookupError)
            return res.sendStatus(500)
        }

        const existingIds = (rows || []).map((row) => Number(row.id)).sort((a,b) => a - b)
        const requestedIds = [...normalizedIds].sort((a,b) => a - b)
        const isCompleteSet = existingIds.length === requestedIds.length &&
            existingIds.every((id, index) => id === requestedIds[index])
        if (!isCompleteSet) {
            return res.sendStatus(400)
        }

        db.run("BEGIN TRANSACTION", (beginError) => {
            if (beginError) {
                console.log(beginError)
                return res.sendStatus(500)
            }

            const rollback = (error) => {
                if (error) console.log(error)
                db.run("ROLLBACK", (rollbackError) => {
                    if (rollbackError) console.log(rollbackError)
                    return res.sendStatus(500)
                })
            }

            const updateNext = (index) => {
                if (index === normalizedIds.length) {
                    return db.run("COMMIT", (commitError) => {
                        if (commitError) {
                            return rollback(commitError)
                        }
                        return res.sendStatus(200)
                    })
                }

                db.run("UPDATE posts SET display_order=? WHERE id=?", index, normalizedIds[index], (updateError) => {
                    if (updateError) {
                        return rollback(updateError)
                    }
                    return updateNext(index + 1)
                })
            }

            updateNext(0)
        })
    })
}

module.exports = reorderPosts
