const mongoose = require('mongoose')

const proposalSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true
    },
    companyUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    notes: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['sent', 'accepted', 'rejected', 'cancelled'],
      default: 'sent'
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Proposal', proposalSchema)