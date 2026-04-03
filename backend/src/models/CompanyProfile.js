const mongoose = require('mongoose')

const companyProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    legalName: {
      type: String,
      required: true
    },
    tradeName: {
      type: String,
      required: true
    },
    cnpj: {
      type: String,
      required: true,
      unique: true
    },
    phone: String,
    address: String,
    fleet: [
      {
        internalId: { type: String, required: true },
        vehicleType: {
          type: String,
          enum: ['van', 'microbus', 'bus'],
          required: true
        },
        plate: { type: String, required: true },
        seats: { type: Number, required: true },
        active: { type: Boolean, default: true }
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model('CompanyProfile', companyProfileSchema)