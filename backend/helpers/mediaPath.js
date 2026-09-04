const fs = require('fs')
const path = require('path')

function getSafeFileName(fileName) {
    if (typeof fileName !== 'string' || !fileName ||
        fileName.includes('/') || fileName.includes('\\') ||
        fileName.includes('\0') || path.basename(fileName) !== fileName) {
        return null
    }
    return fileName
}

async function resolveMediaPath(fileName, uploadDir) {
    const safeFileName = getSafeFileName(fileName)
    if (!safeFileName) {
        return null
    }

    const root = await fs.promises.realpath(uploadDir)
    const candidate = path.resolve(root, safeFileName)
    if (candidate !== root && !candidate.startsWith(root + path.sep)) {
        return null
    }

    try {
        const realPath = await fs.promises.realpath(candidate)
        if (realPath !== root && !realPath.startsWith(root + path.sep)) {
            return null
        }
        const stat = await fs.promises.stat(realPath)
        if (!stat.isFile()) {
            return null
        }
        return realPath
    } catch (error) {
        if (error.code === 'ENOENT') {
            return null
        }
        throw error
    }
}

module.exports = {getSafeFileName, resolveMediaPath}
