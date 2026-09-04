function normalizeKeywords(value) {
    let keywords = value

    if (typeof keywords === 'string') {
        try {
            keywords = JSON.parse(keywords)
        } catch {
            keywords = keywords.split(',')
        }
    }

    if (!Array.isArray(keywords)) {
        return []
    }

    return [...new Set(keywords
        .map((keyword) => String(keyword).trim())
        .filter(Boolean))]
}

function serializeKeywords(value) {
    return JSON.stringify(normalizeKeywords(value))
}

module.exports = {normalizeKeywords, serializeKeywords}
