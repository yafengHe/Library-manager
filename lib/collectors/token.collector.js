const jwt = require('jsonwebtoken')
const key = 'test'

let tokenCollector = {}

tokenCollector.getToken = (user) => {
	const u = {
		name: user.name,
		manage: user.manage || 0
	}
	return jwt.sign(user, key, {
     expiresIn: 60 * 60 * 24 // expires in 24 hours
  })
}

tokenCollector.decodedToken = (token) => {
  try {
    const decoded = jwt.verify(token, key)
    return decoded
  } catch (err) {
    return err
  }
}
tokenCollector.checklogin = (req, res, next) => {
	const token = req.body.token
	if (token) {
		const decoded = tokenCollector.decodedToken(token)
		if (decoded.name === "TokenExpiredError") {
			return res.json({ code:"error", message: "登录过期，请重新登录" })
		} else {
			next()
		}
	} else {
		return res.json({ code:"error", message: "请登录" })
	}
}
module.exports = tokenCollector
