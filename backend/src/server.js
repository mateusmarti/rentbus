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

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/trips', tripRoutes)
app.use('/api/proposals', proposalRoutes)
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/drivers', driverRoutes)

const PORT = process.env.PORT || 3000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
  })
})