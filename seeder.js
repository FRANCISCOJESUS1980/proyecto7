const mongoose = require('mongoose')
const dotenv = require('dotenv')
const User = require('./src/models/User')

dotenv.config()

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Conectado a MongoDB Atlas'))

const seedUsers = async () => {
  try {
    await User.deleteMany()

    const users = [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'user1', password: 'user123', role: 'user' }
    ]

    await User.insertMany(users)
    console.log('Usuarios insertados')
    process.exit()
  } catch (error) {
    console.error('Error al insertar los usuarios', error)
    process.exit(1)
  }
}
seedUsers()
