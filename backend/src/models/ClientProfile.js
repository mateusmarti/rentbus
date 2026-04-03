const mongoose = require('mongoose')

const clientProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    personType: {
      type: String,
      enum: ['pf', 'pj'],
      required: true
    },
    cpf: {
      type: String,
      default: null
    },
    cnpj: {
      type: String,
      default: null
    },
    phone: String,
    address: String
  },
  { timestamps: true }
)

module.exports = mongoose.model('ClientProfile', clientProfileSchema)