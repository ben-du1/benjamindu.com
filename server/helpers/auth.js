function authInit(password,PASSWORD_KEY,res) {
    if (password === PASSWORD_KEY) {
        return res.sendStatus(200)
    }
    return res.sendStatus(404)
}

function authCheck(password,PASSWORD_KEY,res) {
    if (password === PASSWORD_KEY) {
        return true
    } else {
        return false
    }
}

module.exports = {authInit:authInit,authCheck:authCheck}