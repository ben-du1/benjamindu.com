const path = require('path')
const sqlite3 = require('sqlite3').verbose()

const databasePath = path.join(__dirname, 'benjamindu.sql')

function migrateDatabase(db, done) {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            date TEXT NOT NULL,
            content TEXT NOT NULL,
            image TEXT NOT NULL,
            display_order INTEGER NOT NULL DEFAULT 0,
            slug TEXT,
            category TEXT NOT NULL DEFAULT 'serious',
            keywords TEXT NOT NULL DEFAULT '[]'
        )`, (createError) => {
            if (createError) return done(createError)

            db.all('PRAGMA table_info(posts)', (columnsError, columns) => {
                if (columnsError) return done(columnsError)

                const existingColumns = new Set((columns || []).map((column) => column.name))
                const missingColumns = [
                    ['display_order', 'INTEGER NOT NULL DEFAULT 0'],
                    ['slug', 'TEXT'],
                    ['category', "TEXT NOT NULL DEFAULT 'serious'"],
                    ['keywords', "TEXT NOT NULL DEFAULT '[]'"]
                ].filter(([name]) => !existingColumns.has(name))

                const addNextColumn = (index) => {
                    if (index >= missingColumns.length) {
                        return finishMigration(existingColumns, db, done)
                    }

                    const [name, definition] = missingColumns[index]
                    db.run(`ALTER TABLE posts ADD COLUMN ${name} ${definition}`, (alterError) => {
                        if (alterError) return done(alterError)
                        addNextColumn(index + 1)
                    })
                }

                addNextColumn(0)
            })
        })
    })
}

function finishMigration(existingColumns, db, done) {
    const statements = []
    if (!existingColumns.has('display_order')) {
        statements.push('UPDATE posts SET display_order=id')
    }
    statements.push("UPDATE posts SET category='serious' WHERE category IS NULL OR category NOT IN ('serious','fun')")
    statements.push("UPDATE posts SET keywords='[]' WHERE keywords IS NULL OR keywords=''")
    statements.push("CREATE UNIQUE INDEX IF NOT EXISTS posts_slug_unique ON posts(slug) WHERE slug IS NOT NULL AND slug <> ''")

    const runNext = (index) => {
        if (index >= statements.length) return done(null)
        db.run(statements[index], (error) => {
            if (error) return done(error)
            runNext(index + 1)
        })
    }

    runNext(0)
}

if (require.main === module) {
    const db = new sqlite3.Database(databasePath)
    migrateDatabase(db, (error) => {
        if (error) {
            console.error('Database migration failed:', error)
            return db.close(() => process.exitCode = 1)
        }
        console.log('Database migration complete')
        db.close()
    })
}

module.exports = migrateDatabase
