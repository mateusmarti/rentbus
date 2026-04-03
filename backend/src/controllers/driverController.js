const Driver = require('../models/Driver')

exports.createDriver = async (req, res) => {
  try {
    const { name, cpf, phone, licenseNumber } = req.body

    if (!name || !cpf || !phone || !licenseNumber) {
      return res.status(400).json({ message: 'Preencha os campos obrigatórios do motorista' })
    }

    const driver = await Driver.create({
      companyUser: req.user.id,
      name,
      cpf,
      phone,
      licenseNumber
    })

    res.status(201).json(driver)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar motorista', error: error.message })
  }
}

exports.getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ companyUser: req.user.id }).sort({ createdAt: -1 })
    res.json(drivers)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar motoristas' })
  }
}

exports.updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findOneAndUpdate(
      { _id: req.params.id, companyUser: req.user.id },
      req.body,
      { new: true }
    )

    if (!driver) {
      return res.status(404).json({ message: 'Motorista não encontrado' })
    }

    res.json(driver)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar motorista', error: error.message })
  }
}

exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findOneAndDelete({
      _id: req.params.id,
      companyUser: req.user.id
    })

    if (!driver) {
      return res.status(404).json({ message: 'Motorista não encontrado' })
    }

    res.json({ message: 'Motorista removido com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover motorista' })
  }
}