const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema(
  {
    companyUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    code: {
      type: String,
      required: true
    },
    internalId: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    seats: {
      type: Number,
      required: true
    },
    vehicleType: {
      type: String,
      enum: ['van', 'microbus', 'bus'],
      required: true
    },
    comfortType: {
      type: String,
      enum: ['urbano', 'executivo', 'leito'],
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

module.exports = mongoose.model('Vehicle', vehicleSchema)