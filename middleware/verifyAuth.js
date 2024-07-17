const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.header('x-token')

    if(!token) return res.status(401).json({
        message: "no token",
        success: false
    })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(400).json({
            message: "no token / token error",
            success: false
        })
    }

}   