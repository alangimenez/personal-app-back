class MidSecurity {
    constructor() {}

    checkPassword (req, res, next) {
        // const indexHeader = req.headers.findIndex((e) => e == 'Password-Security')
        console.log(req.headers)
        console.log(process.env.WORD_SECRET)
        console.log(req.headers.password)
        if (req.headers.password == process.env.WORD_SECRET) {
            next()
        } else {
            res.status(401).json({"error_message": "You are not allowed to do this operation"})
        }
    }
}

const midSecurity = new MidSecurity()

module.exports = midSecurity