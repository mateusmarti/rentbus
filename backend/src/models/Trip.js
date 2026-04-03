const mongoose = require('mongoose')

const stopSchema = new mongoose.Schema(
  {
    cep: { type: String, default: '' },
    street: { type: String, default: '' },
    number: { type: String, default: '' },
    neighborhood: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    label: { type: String, required: true },
    lat: { type: Number, default: null },
    lng: { type: Number, default: null }
  },
  { _id: false }
)

const passengerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    document: { type: String, required: true }
  },
  { _id: false }
)

const tripSchema = new mongoose.Schema(
  {
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
    title: {
      type: String,
      required: true
    },

    originCep: { type: String, default: '' },
    originStreet: { type: String, default: '' },
    originNumber: { type: String, default: '' },
    originComplement: { type: String, default: '' },
    originNeighborhood: { type: String, default: '' },
    originCity: { type: String, default: '' },
    originState: { type: String, default: '' },
    originLabel: {
      type: String,
      required: true
    },
    originLat: { type: Number, default: null },
    originLng: { type: Number, default: null },

    destinationCep: { type: String, default: '' },
    destinationStreet: { type: String, default: '' },
    destinationNumber: { type: String, default: '' },
    destinationComplement: { type: String, default: '' },
    destinationNeighborhood: { type: String, default: '' },
    destinationCity: { type: String, default: '' },
    destinationState: { type: String, default: '' },
    destinationLabel: {
      type: String,
      required: true
    },
    destinationLat: { type: Number, default: null },
    destinationLng: { type: Number, default: null },

    stops: [stopSchema],

    requestedVehicleType: {
      type: String,
      enum: [
        'van',
        'micro_urbano',
        'midi_urbano',
        'urbano_grande',
        'executivo',
        'leito',
        'semileito'
      ],
      default: 'urbano_grande'
    },

    maxPassengers: {
      type: Number,
      required: true
    },
    tripDate: {
      type: Date,
      required: true
    },
    notes: {
      type: String,
      default: ''
    },

    acceptedProposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proposal',
      default: null
    },
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      default: null
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null
    },

    passengers: [passengerSchema],

    paymentStatus: {
      type: String,
      enum: ['not_paid', 'paid'],
      default: 'not_paid'
    },
    status: {
      type: String,
      enum: [
        'requested',
        'quoted',
        'accepted',
        'paid',
        'preparing_trip',
        'in_progress',
        'completed',
        'cancelled'
      ],
      default: 'requested'
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Trip', tripSchema)