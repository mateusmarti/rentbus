const Proposal = require('../models/Proposal')
const Trip = require('../models/Trip')

exports.createProposal = async (req, res) => {
  try {
    const { tripId, amount, notes = '' } = req.body

    if (!tripId || !amount) {
      return res.status(400).json({ message: 'Trip e valor são obrigatórios' })
    }

    const trip = await Trip.findById(tripId)
    if (!trip) {
      return res.status(404).json({ message: 'Viagem não encontrada' })
    }

    if (!['requested', 'quoted'].includes(trip.status)) {
      return res.status(400).json({ message: 'Essa viagem não está aberta para orçamento' })
    }

    const existingProposal = await Proposal.findOne({
      trip: tripId,
      companyUser: req.user.id,
      status: { $in: ['sent'] }
    })

    if (existingProposal) {
      existingProposal.amount = amount
      existingProposal.notes = notes
      await existingProposal.save()

      trip.status = 'quoted'
      await trip.save()

      return res.json({ message: 'Orçamento atualizado com sucesso', proposal: existingProposal })
    }

    const proposal = await Proposal.create({
      trip: tripId,
      companyUser: req.user.id,
      amount,
      notes
    })

    trip.status = 'quoted'
    await trip.save()

    res.status(201).json({ message: 'Orçamento enviado com sucesso', proposal })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao enviar orçamento', error: error.message })
  }
}

exports.getCompanyProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ companyUser: req.user.id })
      .populate('trip')
      .sort({ createdAt: -1 })

    res.json(proposals)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar orçamentos da empresa' })
  }
}