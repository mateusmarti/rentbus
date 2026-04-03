const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      unique: true
    },
    clientUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    companyUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled', 'refunded'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['pix', 'card', 'bank_slip'],
      default: 'pix'
    },
    payerCpf: {
      type: String,
      default: ''
    },
    billingAddress: {
      type: String,
      default: ''
    },
    cardHolderName: {
      type: String,
      default: ''
    },
    cardLast4: {
      type: String,
      default: ''
    },
    submittedAt: {
      type: Date,
      default: null
    },
    paidAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Payment', paymentSchema)