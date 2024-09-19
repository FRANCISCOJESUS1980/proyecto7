const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password')

      if (!req.user) {
        return res
          .status(401)
          .json({ message: 'No autorizado, usuario no encontrado' })
      }

      next()
    } catch (error) {
      console.error('Error al verificar el token:', error)
      return res.status(401).json({ message: 'No autorizado, token inválido' })
    }
  } else {
    return res.status(401).json({ message: 'No autorizado, no hay token' })
  }
}

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ message: 'No autorizado, solo administradores' })
  }
}

module.exports = { protect, admin }
