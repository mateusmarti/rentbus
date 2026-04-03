const Vehicle = require('../models/Vehicle')

exports.createVehicle = async (req, res) => {
  try {
    const { code, internalId, model, seats, vehicleType, comfortType } = req.body

    if (!code || !internalId || !model || !seats || !vehicleType || !comfortType) {
      return res.status(400).json({ message: 'Preencha os campos obrigatórios do veículo' })
    }

    const vehicle = await Vehicle.create({
      companyUser: req.user.id,
      code,
      internalId,
      model,
      seats,
      vehicleType,
      comfortType
    })

    res.status(201).json(vehicle)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar veículo', error: error.message })
  }
}

exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ companyUser: req.user.id }).sort({ createdAt: -1 })
    res.json(vehicles)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar veículos' })
  }
}

exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, companyUser: req.user.id },
      req.body,
      { new: true }
    )

    if (!vehicle) {
      return res.status(404).json({ message: 'Veículo não encontrado' })
    }

    res.json(vehicle)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar veículo', error: error.message })
  }
}

exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      companyUser: req.user.id
    })

    if (!vehicle) {
      return res.status(404).json({ message: 'Veículo não encontrado' })
    }

    res.json({ message: 'Veículo removido com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover veículo' })
  }
}