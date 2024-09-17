const User = require('../models/User')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '5h'
  })
}

const registerUser = async (req, res) => {
  const { username, password } = req.body
  const userExists = await User.findOne({ username })

  if (userExists) {
    return res.status(400).json({ message: 'El usuario ya existe' })
  }

  const user = new User({ username, password })

  await user.save()
  res.status(201).json({
    _id: user._id,
    username: user.username,
    token: generateToken(user._id)
  })
}

const loginUser = async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })

  if (user && (await user.comparePassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user._id)
    })
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' })
  }
}

const getUsers = async (req, res) => {
  const users = await User.find()
  res.json(users)
}

const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.role = req.body.role || user.role
    await user.save()
    res.json({ message: 'Usuario actualizado' })
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' })
  }
}

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'Usuario eliminado' })
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' })
  }
}

module.exports = { registerUser, loginUser, getUsers, updateUser, deleteUser }
