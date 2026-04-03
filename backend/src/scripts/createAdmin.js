require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    const existingAdmin = await User.findOne({ email: 'admin@rentbus.com' })

    if (existingAdmin) {
      console.log('Admin já existe')
      process.exit()
    }

    const hashedPassword = await bcrypt.hash('123456', 10)

    await User.create({
      name: 'Administrador',
      email: 'admin@rentbus.com',
      password: hashedPassword,
      role: 'admin'
    })

    console.log('Admin criado com sucesso')
    console.log('Email: admin@rentbus.com')
    console.log('Senha: 123456')

    process.exit()
  } catch (error) {
    console.error('Erro ao criar admin:', error)
    process.exit(1)
  }
}

createAdmin()