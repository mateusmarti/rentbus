const express = require('express')
const cors = require('cors')
require('dotenv').config()

const connectDB = require('./config/db')

const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const tripRoutes = require('./routes/tripRoutes')
const proposalRoutes = require('./routes/proposalRoutes')
const vehicleRoutes = require('./routes/vehicleRoutes')
const driverRoutes = require('./routes/driverRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ message: 'API RentBus rodando com sucesso' })
})

app.get('/health', async (_req, res) => {
  try {
    const mongoose = require('mongoose')
    const dbState = mongoose.connection.readyState

    if (dbState !== 1) {
      return res.status(503).json({
        ok: false,
        message: 'Banco de dados não está conectado'
      })
    }

    return res.status(200).json({
      ok: true,
      message: 'API e banco conectados'
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Erro ao verificar saúde da aplicação'
    })
  }
})

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/trips', tripRoutes)
app.use('/api/proposals', proposalRoutes)
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/drivers', driverRoutes)

app.use((err, _req, res, _next) => {
  console.error('Erro interno:', err)
  res.status(500).json({ message: 'Erro interno do servidor' })
})

const PORT = process.env.PORT || 3000

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Erro ao conectar no banco:', error)
    process.exit(1)
  })