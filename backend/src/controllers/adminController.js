const bcrypt = require('bcryptjs')
const User = require('../models/User')
const CompanyProfile = require('../models/CompanyProfile')
const ClientProfile = require('../models/ClientProfile')
const Trip = require('../models/Trip')
const Payment = require('../models/Payment')
const Proposal = require('../models/Proposal')
const Vehicle = require('../models/Vehicle')
const Driver = require('../models/Driver')

function normalizeStops(stops = []) {
  if (!Array.isArray(stops)) return []

  return stops
    .filter((stop) => stop && stop.label && stop.label.trim() !== '')
    .map((stop) => ({
      cep: stop.cep || '',
      street: stop.street || '',
      number: stop.number || '',
      neighborhood: stop.neighborhood || '',
      city: stop.city || '',
      state: stop.state || '',
      label: stop.label.trim(),
      lat: stop.lat ?? null,
      lng: stop.lng ?? null
    }))
}

exports.getOverview = async (_req, res) => {
  try {
    const [users, companies, clients, trips, payments, proposals, vehicles, drivers] =
      await Promise.all([
        User.find().select('-password').sort({ createdAt: -1 }),
        CompanyProfile.find().populate('user', 'name email role status').sort({ createdAt: -1 }),
        ClientProfile.find().populate('user', 'name email role status').sort({ createdAt: -1 }),
        Trip.find()
          .populate('clientUser', 'name email')
          .populate('companyUser', 'name email')
          .populate('acceptedProposal')
          .populate('assignedVehicle')
          .populate('assignedDriver')
          .sort({ createdAt: -1 }),
        Payment.find()
          .populate('trip')
          .populate('clientUser', 'name email')
          .populate('companyUser', 'name email')
          .sort({ createdAt: -1 }),
        Proposal.find().populate('trip').populate('companyUser', 'name email').sort({ createdAt: -1 }),
        Vehicle.find().populate('companyUser', 'name email').sort({ createdAt: -1 }),
        Driver.find().populate('companyUser', 'name email').sort({ createdAt: -1 })
      ])

    res.json({
      users,
      companies,
      clients,
      trips,
      payments,
      proposals,
      vehicles,
      drivers
    })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao carregar dados do administrador', error: error.message })
  }
}

exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      status = 'active',
      personType,
      cpf,
      cnpj,
      legalName,
      tradeName,
      phone
    } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Nome, e-mail, senha e perfil são obrigatórios' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Já existe usuário com este e-mail' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      status
    })

    if (role === 'company') {
      if (!legalName || !tradeName || !cnpj) {
        return res.status(400).json({ message: 'Empresa precisa de razão social, nome fantasia e CNPJ' })
      }

      await CompanyProfile.create({
        user: user._id,
        legalName,
        tradeName,
        cnpj,
        phone: phone || ''
      })
    }

    if (role === 'client') {
      if (!personType || !['pf', 'pj'].includes(personType)) {
        return res.status(400).json({ message: 'Tipo de pessoa inválido' })
      }

      if (personType === 'pf' && !cpf) {
        return res.status(400).json({ message: 'CPF é obrigatório para PF' })
      }

      if (personType === 'pj' && !cnpj) {
        return res.status(400).json({ message: 'CNPJ é obrigatório para PJ' })
      }

      await ClientProfile.create({
        user: user._id,
        personType,
        cpf: personType === 'pf' ? cpf : null,
        cnpj: personType === 'pj' ? cnpj : null,
        phone: phone || ''
      })
    }

    const createdUser = await User.findById(user._id).select('-password')
    res.status(201).json(createdUser)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error: error.message })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, status, password } = req.body
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    if (name !== undefined) user.name = name
    if (email !== undefined) user.email = email
    if (role !== undefined) user.role = role
    if (status !== undefined) user.status = status

    if (password) {
      user.password = await bcrypt.hash(password, 10)
    }

    await user.save()

    res.json(await User.findById(user._id).select('-password'))
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    await CompanyProfile.deleteOne({ user: req.params.id })
    await ClientProfile.deleteOne({ user: req.params.id })
    await User.findByIdAndDelete(req.params.id)

    res.json({ message: 'Usuário removido com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover usuário', error: error.message })
  }
}

exports.createCompany = async (req, res) => {
  try {
    const { userName, email, password, legalName, tradeName, cnpj, phone } = req.body

    if (!userName || !email || !password || !legalName || !tradeName || !cnpj) {
      return res.status(400).json({ message: 'Preencha os campos obrigatórios da empresa' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Já existe usuário com este e-mail' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name: userName,
      email,
      password: hashedPassword,
      role: 'company',
      status: 'active'
    })

    const company = await CompanyProfile.create({
      user: user._id,
      legalName,
      tradeName,
      cnpj,
      phone: phone || ''
    })

    res.status(201).json(await CompanyProfile.findById(company._id).populate('user', 'name email role status'))
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar empresa', error: error.message })
  }
}

exports.updateCompany = async (req, res) => {
  try {
    const { userName, email, status, legalName, tradeName, cnpj, phone } = req.body

    const company = await CompanyProfile.findById(req.params.id)
    if (!company) {
      return res.status(404).json({ message: 'Empresa não encontrada' })
    }

    const user = await User.findById(company.user)
    if (!user) {
      return res.status(404).json({ message: 'Usuário da empresa não encontrado' })
    }

    if (userName !== undefined) user.name = userName
    if (email !== undefined) user.email = email
    if (status !== undefined) user.status = status
    await user.save()

    if (legalName !== undefined) company.legalName = legalName
    if (tradeName !== undefined) company.tradeName = tradeName
    if (cnpj !== undefined) company.cnpj = cnpj
    if (phone !== undefined) company.phone = phone
    await company.save()

    res.json(await CompanyProfile.findById(company._id).populate('user', 'name email role status'))
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar empresa', error: error.message })
  }
}

exports.deleteCompany = async (req, res) => {
  try {
    const company = await CompanyProfile.findById(req.params.id)
    if (!company) {
      return res.status(404).json({ message: 'Empresa não encontrada' })
    }

    await User.findByIdAndDelete(company.user)
    await CompanyProfile.findByIdAndDelete(company._id)

    res.json({ message: 'Empresa removida com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover empresa', error: error.message })
  }
}

exports.createTrip = async (req, res) => {
  try {
    const {
      clientUser,
      companyUser = null,
      title,
      originCep,
      originStreet,
      originNumber,
      originNeighborhood,
      originCity,
      originState,
      originLabel,
      originLat,
      originLng,
      destinationCep,
      destinationStreet,
      destinationNumber,
      destinationNeighborhood,
      destinationCity,
      destinationState,
      destinationLabel,
      destinationLat,
      destinationLng,
      stops = [],
      maxPassengers,
      tripDate,
      notes = '',
      status = 'requested',
      paymentStatus = 'not_paid'
    } = req.body

    if (!clientUser || !title || !originLabel || !destinationLabel || !maxPassengers || !tripDate) {
      return res.status(400).json({ message: 'Preencha os campos obrigatórios da viagem' })
    }

    const trip = await Trip.create({
      clientUser,
      companyUser,
      title,
      originCep: originCep || '',
      originStreet: originStreet || '',
      originNumber: originNumber || '',
      originNeighborhood: originNeighborhood || '',
      originCity: originCity || '',
      originState: originState || '',
      originLabel,
      originLat: originLat ?? null,
      originLng: originLng ?? null,
      destinationCep: destinationCep || '',
      destinationStreet: destinationStreet || '',
      destinationNumber: destinationNumber || '',
      destinationNeighborhood: destinationNeighborhood || '',
      destinationCity: destinationCity || '',
      destinationState: destinationState || '',
      destinationLabel,
      destinationLat: destinationLat ?? null,
      destinationLng: destinationLng ?? null,
      stops: normalizeStops(stops),
      maxPassengers,
      tripDate,
      notes,
      status,
      paymentStatus
    })

    res.status(201).json(trip)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar viagem', error: error.message })
  }
}

exports.updateTrip = async (req, res) => {
  try {
    const payload = { ...req.body }

    if (payload.stops) {
      payload.stops = normalizeStops(payload.stops)
    }

    const trip = await Trip.findByIdAndUpdate(req.params.id, payload, { new: true })
    if (!trip) {
      return res.status(404).json({ message: 'Viagem não encontrada' })
    }

    res.json(trip)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar viagem', error: error.message })
  }
}

exports.deleteTrip = async (req, res) => {
  try {
    await Payment.deleteOne({ trip: req.params.id })
    await Proposal.deleteMany({ trip: req.params.id })
    await Trip.findByIdAndDelete(req.params.id)

    res.json({ message: 'Viagem removida com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover viagem', error: error.message })
  }
}

exports.markTripAsPaid = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
    if (!trip) {
      return res.status(404).json({ message: 'Viagem não encontrada' })
    }

    trip.paymentStatus = 'paid'

    if (trip.status === 'accepted' || trip.status === 'requested' || trip.status === 'quoted') {
      trip.status = 'paid'
    }

    await trip.save()

    let payment = await Payment.findOne({ trip: trip._id })

    if (!payment) {
      payment = await Payment.create({
        trip: trip._id,
        clientUser: trip.clientUser,
        companyUser: trip.companyUser,
        amount: 0,
        status: 'paid',
        paidAt: new Date(),
        paymentMethod: 'pix'
      })
    } else {
      payment.status = 'paid'
      payment.paidAt = new Date()
      await payment.save()
    }

    res.json({ message: 'Viagem marcada como paga com sucesso', trip, payment })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao marcar viagem como paga', error: error.message })
  }
}