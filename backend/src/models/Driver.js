const mongoose = require('mongoose')

const driverSchema = new mongoose.Schema(
  {
    companyUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    cpf: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    licenseNumber: {
      type: String,
      required: true
    },
    photoUrl: {
      type: String,
      default: ''
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Driver', driverSchema)