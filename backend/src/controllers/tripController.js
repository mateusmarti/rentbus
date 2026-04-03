const Trip = require('../models/Trip')
const Proposal = require('../models/Proposal')
const Payment = require('../models/Payment')
const Vehicle = require('../models/Vehicle')
const Driver = require('../models/Driver')

function canCancel(tripDate) {
  const now = new Date()
  const limit = new Date(tripDate)
  const diffMs = limit.getTime() - now.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays >= 7
}

function normalizeStops(stops = []) {
  if (!Array.isArray(stops)) return []

  return stops
    .filter((stop) => stop && stop.label && String(stop.label).trim() !== '')
    .map((stop) => ({
      cep: stop.cep || '',
      street: stop.street || '',
      number: stop.number || '',
      neighborhood: stop.neighborhood || '',
      city: stop.city || '',
      state: stop.state || '',
      label: String(stop.label).trim(),
      lat: stop.lat ?? null,
      lng: stop.lng ?? null
    }))
}

exports.createTrip = async (req, res) => {
  try {
    const {
      title,
      busType,
      originCep,
      originStreet,
      originNumber,
      originComplement,
      originNeighborhood,
      originCity,
      originState,
      originLabel,
      originLat,
      originLng,
      destinationCep,
      destinationStreet,
      destinationNumber,
      destinationComplement,
      destinationNeighborhood,
      destinationCity,
      destinationState,
      destinationLabel,
      destinationLat,
      destinationLng,
      stops = [],
      maxPassengers,
      tripDate,
      notes = ''
    } = req.body

    if (!title || !originLabel || !destinationLabel || !maxPassengers || !tripDate) {
      return res.status(400).json({ message: 'Preencha os campos obrigatórios da viagem.' })
    }

    const trip = await Trip.create({
      clientUser: req.user.id,
      title,
      busType: busType || 'urbano',
      originCep: originCep || '',
      originStreet: originStreet || '',
      originNumber: originNumber || '',
      originComplement: originComplement || '',
      originNeighborhood: originNeighborhood || '',
      originCity: originCity || '',
      originState: originState || '',
      originLabel,
      originLat: originLat ?? null,
      originLng: originLng ?? null,
      destinationCep: destinationCep || '',
      destinationStreet: destinationStreet || '',
      destinationNumber: destinationNumber || '',
      destinationComplement: destinationComplement || '',
      destinationNeighborhood: destinationNeighborhood || '',
      destinationCity: destinationCity || '',
      destinationState: destinationState || '',
      destinationLabel,
      destinationLat: destinationLat ?? null,
      destinationLng: destinationLng ?? null,
      stops: normalizeStops(stops),
      maxPassengers,
      tripDate,
      notes
    })

    res.status(201).json(trip)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar viagem', error: error.message })
  }
}

exports.getClientTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ clientUser: req.user.id })
      .populate('companyUser', 'name email')
      .populate('acceptedProposal')
      .populate('assignedVehicle')
      .populate('assignedDriver')
      .sort({ tripDate: -1 })

    res.json(trips)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar viagens do contratante' })
  }
}

exports.getCompanyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      companyUser: req.user.id,
      status: { $in: ['accepted', 'paid', 'preparing_trip', 'in_progress', 'completed'] }
    })
      .populate('clientUser', 'name email')
      .populate('acceptedProposal')
      .populate('assignedVehicle')
      .populate('assignedDriver')
      .sort({ tripDate: -1 })

    res.json(trips)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar viagens da empresa' })
  }
}

exports.getOpenTripsForCompanies = async (req, res) => {
  try {
    const trips = await Trip.find({
      status: { $in: ['requested', 'quoted'] }
    })
      .populate('clientUser', 'name email')
      .sort({ tripDate: 1 })

    res.json(trips)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar solicitações abertas' })
  }
}

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId)
      .populate('clientUser', 'name email')
      .populate('companyUser', 'name email')
      .populate('acceptedProposal')
      .populate('assignedVehicle')
      .populate('assignedDriver')

    if (!trip) {
      return res.status(404).json({ message: 'Viagem não encontrada' })
    }

    if (
      req.user.role === 'client' &&
      String(trip.clientUser?._id || trip.clientUser) !== String(req.user.id)
    ) {
      return res.status(403).json({ message: 'Acesso negado' })
    }

    if (
      req.user.role === 'company' &&
      String(trip.companyUser?._id || trip.companyUser || '') !== String(req.user.id) &&
      !['requested', 'quoted'].includes(trip.status)
    ) {
      return res.status(403).json({ message: 'Acesso negado' })
    }

    res.json(trip)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar viagem', error: error.message })
  }
}

exports.getTripPayment = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId)
    if (!trip) {
      return res.status(404).json({ message: 'Viagem não encontrada' })
    }

    if (
      req.user.role === 'client' &&
      String(trip.clientUser) !== String(req.user.id)
    ) {
      return res.status(403).json({ message: 'Acesso negado' })
    }

    if (
      req.user.role === 'company' &&
      String(trip.companyUser || '') !== String(req.user.id)
    ) {
      return res.status(403).json({ message: 'Acesso negado' })
    }

    const payment = await Payment.findOne({ trip: trip._id })
    res.json(payment || null)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pagamento', error: error.message })
  }
}

exports.getTripProposals = async (req, res) => {
  try {
    const { tripId } = req.params

    const trip = await Trip.findById(tripId)
    if (!trip) {
      return res.status(404).json({ message: 'Viagem não encontrada' })
    }

    if (req.user.role === 'client' && String(trip.clientUser) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Acesso negado' })
    }

    const proposals = await Proposal.find({ trip: tripId })
      .populate('companyUser', 'name email')
      .sort({ createdAt: -1 })

    res.json(proposals)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar orçamentos' })
  }
}

exports.acceptProposal = async (req, res) => {
  try {
    const { proposalId } = req.params

    const proposal = await Proposal.findById(proposalId)
    if (!proposal) {
      return res.status(404).json({ message: 'Orçamento não encontrado' })
    }

    const trip = await Trip.findById(proposal.trip)
    if (!trip) {
      return res.status(404).json({ message: 'Viagem não encontrada' })
    }

    if (String(trip.clientUser) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Acesso negado' })
    }

    if (trip.status === 'cancelled' || trip.status === 'completed') {
      return res.status(400).json({ message: 'Não é possível aceitar orçamento para essa viagem' })
    }

    trip.acceptedProposal = proposal._id
    trip.companyUser = proposal.companyUser
    trip.status = 'accepted'
    await trip.save()

    await Proposal.updateMany(
      { trip: trip._id, _id: { $ne: proposal._id } },
      { status: 'rejected' }
    )

    proposal.status = 'accepted'
    await proposal.save()

    const existingPayment = await Payment.findOne({ trip: trip._id })
    if (!existingPayment) {
      await Payment.create({
        trip: trip._id,
        clientUser: trip.clientUser,
        companyUser: proposal.companyUser,
        amount: proposal.amount,
        status: 'pending'
      })
    }

    res.json({ message: 'Orçamento aceito com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao aceitar orçamento', error: error.message })
  }
}

exports.payTrip = async (req, res) => {
  try {
    const { tripId } = req.params
    const {
      paymentMethod = 'pix',
      payerCpf = '',
      billingAddress = '',
      cardHolderName = '',
      cardNumber = ''
    } = req.body

    const trip = await Trip.findById(tripId).populate('acceptedProposal')
    if (!trip) {
      return res.status(404).json({ message: 'Viagem não encontrada' })
    }

    if (String(trip.clientUser) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Acesso negado' })
    }

    if (!trip.acceptedProposal) {
      return res.status(400).json({ message: 'A viagem ainda não possui orçamento aceito' })
    }

    let payment = await Payment.findOne({ trip: trip._id })

    const cardLast4 =
      paymentMethod === 'card'
        ? String(cardNumber || '').replace(/\D/g, '').slice(-4)
        : ''

    if (!payment) {
      payment = await Payment.create({
        trip: trip._id,
        clientUser: trip.clientUser,
        companyUser: trip.companyUser,
        amount: trip.acceptedProposal.amount,
        paymentMethod,
        payerCpf,
        billingAddress,
        cardHolderName,
        cardLast4,
        status: 'pending',
        submittedAt: new Date()
      })
    } else {
      payment.paymentMethod = paymentMethod
      payment.payerCpf = payerCpf
      payment.billingAddress = billingAddress
      payment.cardHolderName = cardHolderName
      payment.cardLast4 = cardLast4
      payment.status = payment.status === 'paid' ? 'paid' : 'pending'
      payment.submittedAt = new Date()
      await payment.save()
    }

    res.json({
      message: 'Pagamento enviado para validação',
      payment
    })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar pagamento', error: error.message })
  }
}

exports.addPassengers = async (req, res) => {
  try {
    const { tripId } = req.params
    const { passengers } = req.body

    const trip = await Trip.findById(tripId)

    if (!trip) {
      return res.status(404).json({ message: 'Viagem não encontrada' })
    }

    if (String(trip.clientUser) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Acesso negado' })
    }

    if (trip.paymentStatus !== 'paid') {
      return res.status(400).json({
        message: 'Só é possível cadastrar passageiros após pagamento validado'
      })
    }

    if (!Array.isArray(passengers)) {
      return res.status(400).json({
        message: 'Lista de passageiros inválida'
      })
    }

    const validPassengers = passengers
      .map((p) => ({
        name: String(p?.name || '').trim(),
        document: String(p?.document || '').replace(/\D/g, '')
      }))
      .filter((p) => p.name.length > 2 && p.document.length >= 5)

    if (!validPassengers.length) {
      return res.status(400).json({
        message: 'Informe pelo menos um passageiro válido'
      })
    }

    if (validPassengers.length > Number(trip.maxPassengers)) {
      return res.status(400).json({
        message: 'Quantidade de passageiros maior que o permitido'
      })
    }

    trip.passengers = validPassengers
    await trip.save()

    res.json({
      message: 'Passageiros salvos com sucesso',
      passengers: trip.passengers
    })
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao cadastrar passageiros',
      error: error.message
    })
  }
}

exports.cancelTripByClient = async (req, res) => {
  try {
    const { tripId } = req.params

    const trip = await Trip.findById(tripId)
    if (!trip) {
      return res.status(404).json({ message: 'Viagem não encontrada' })
    }

    if (String(trip.clientUser) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Acesso negado' })
    }

    if (!canCancel(trip.tripDate)) {
      return res.status(400).json({
        message: 'Não é possível cancelar com menos de 7 dias de antecedência'
      })
    }

    trip.status = 'cancelled'
    await trip.save()

    const payment = await Payment.findOne({ trip: trip._id })
    if (payment && payment.status === 'paid') {
      payment.status = 'refunded'
      await payment.save()
    }

    await Proposal.updateMany(
      { trip: trip._id, status: { $in: ['sent', 'accepted'] } },
      { status: 'cancelled' }
    )

    res.json({ message: 'Viagem cancelada com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cancelar viagem', error: error.message })
  }
}

exports.cancelTripByCompany = async (req, res) => {
  try {
    const { tripId } = req.params

    const trip = await Trip.findById(tripId)
    if (!trip) {
      return res.status(404).json({ message: 'Viagem não encontrada' })
    }

    if (String(trip.companyUser || '') !== String(req.user.id)) {
      return res.status(403).json({ message: 'Acesso negado' })
    }

    if (!canCancel(trip.tripDate)) {
      return res.status(400).json({
        message: 'A empresa não pode cancelar com menos de 7 dias de antecedência'
      })
    }

    trip.status = 'cancelled'
    await trip.save()

    const payment = await Payment.findOne({ trip: trip._id })
    if (payment && payment.status === 'paid') {
      payment.status = 'refunded'
      await payment.save()
    }

    res.json({ message: 'Viagem cancelada pela empresa com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cancelar viagem', error: error.message })
  }
}

exports.allocateResources = async (req, res) => {
  try {
    const { tripId } = req.params
    const { vehicleId, driverId } = req.body

    const trip = await Trip.findById(tripId)
    if (!trip) {
      return res.status(404).json({ message: 'Viagem não encontrada' })
    }

    if (String(trip.companyUser || '') !== String(req.user.id)) {
      return res.status(403).json({ message: 'Acesso negado' })
    }

    if (trip.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Só é possível alocar veículo e motorista após o pagamento validado' })
    }

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      companyUser: req.user.id
    })

    const driver = await Driver.findOne({
      _id: driverId,
      companyUser: req.user.id
    })

    if (!vehicle || !driver) {
      return res.status(400).json({ message: 'Veículo ou motorista inválido' })
    }

    trip.assignedVehicle = vehicle._id
    trip.assignedDriver = driver._id
    trip.status = 'preparing_trip'
    await trip.save()

    res.json({ message: 'Veículo e motorista alocados com sucesso', trip })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao alocar recursos', error: error.message })
  }
}