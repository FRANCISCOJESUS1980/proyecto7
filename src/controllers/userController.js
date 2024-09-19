const User = require('../models/User')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

const generateToken = (userId, userRole = 'user') => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno')
  }

  const payload = {
    id: userId,
    role: userRole
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Nombre de usuario y contraseña son obligatorios' })
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'La contraseña debe tener al menos 6 caracteres' })
    }

    const userExists = await User.findOne({ username })

    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' })
    }

    const user = new User({ username, password })
    await user.save()

    const token = generateToken(user._id)

    res.status(201).json({
      _id: user._id,
      username: user.username,
      token
    })
  } catch (error) {
    console.error('Error en el registro del usuario:', error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Nombre de usuario y contraseña son obligatorios' })
    }

    const user = await User.findOne({ username })

    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user._id)

      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token
      })
    } else {
      res.status(401).json({ message: 'Credenciales incorrectas' })
    }
  } catch (error) {
    console.error('Error en el inicio de sesión:', error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

const getUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'No autorizado para ver la lista de usuarios' })
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const users = await User.find().skip(skip).limit(limit).select('-password')

    const totalUsers = await User.countDocuments()

    res.json({
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      users
    })
  } catch (error) {
    console.error('Error al obtener los usuarios:', error)
    res.status(500).json({ message: 'Error al obtener los usuarios' })
  }
}

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    if (req.body.role && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'No autorizado para cambiar el rol' })
    }

    user.role = req.body.role || user.role

    await user.save()

    const { password, ...updatedUser } = user.toObject()

    res.json({ message: 'Usuario actualizado', user: updatedUser })
  } catch (error) {
    console.error('Error al actualizar el usuario:', error)
    res.status(500).json({ message: 'Error al actualizar el usuario' })
  }
}

const deleteUser = async (req, res) => {
  try {
    if (
      req.user.role !== 'admin' &&
      req.user._id.toString() !== req.params.id
    ) {
      return res
        .status(403)
        .json({ message: 'No autorizado para eliminar este usuario' })
    }

    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    await Post.deleteMany({ user: req.params.id })
    await Comment.deleteMany({ user: req.params.id })

    res.json({
      message: 'Usuario y datos relacionados eliminados correctamente'
    })
  } catch (error) {
    console.error('Error al eliminar el usuario:', error)
    res.status(500).json({ message: 'Error al eliminar el usuario' })
  }
}

module.exports = { registerUser, loginUser, getUsers, updateUser, deleteUser }
