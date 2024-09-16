const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()
const app = express()
app.use(express.json())

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((err) => console.log(err))

  app.use(/api/users, require("./routes/userRoutes"));

  app.listen(3000, () => {
    console.log('Servidor levantado en: http://localhost:3000')
  })
  