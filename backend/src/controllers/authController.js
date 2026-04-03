const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const CompanyProfile = require('../models/CompanyProfile')
const ClientProfile = require('../models/ClientProfile')

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )
}

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      legalName,
      tradeName,
      cnpj,
      phone,
      personType,
      cpf
    } = req.body

    if (!['company', 'client'].includes(role)) {
      return res.status(400).json({
        message: 'Somente company ou client podem ser cadastrados pela tela'
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já cadastrado' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    })

    if (role === 'company') {
      if (!legalName || !tradeName || !cnpj) {
        return res.status(400).json({
          message: 'Empresa precisa de razão social, nome fantasia e CNPJ'
        })
      }

      await CompanyProfile.create({
        user: user._id,
        legalName,
        tradeName,
        cnpj,
        phone
      })
    }

    if (role === 'client') {
      if (!personType || !['pf', 'pj'].includes(personType)) {
        return res.status(400).json({
          message: 'Tipo de pessoa inválido'
        })
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
        phone
      })
    }

    return res.status(201).json({ message: 'Cadastro realizado com sucesso' })
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao cadastrar', error: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Senha inválida' })
    }

    const token = generateToken(user)

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    })
  } catch (error) {
    return res.status(500).json({ message: 'Erro no login', error: error.message })
  }
}

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')

    let profile = null

    if (user.role === 'client') {
      profile = await ClientProfile.findOne({ user: user._id })
    }

    if (user.role === 'company') {
      profile = await CompanyProfile.findOne({ user: user._id })
    }

    return res.json({ user, profile })
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar usuário' })
  }
}

exports.updateMe = async (req, res) => {
  try {
    const { name, email, phone, cpf, cnpj, personType } = req.body

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email })
      if (existingUser && String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({ message: 'E-mail já está em uso' })
      }
      user.email = email
    }

    if (name) user.name = name

    await user.save()

    if (user.role === 'client') {
      const profile = await ClientProfile.findOne({ user: user._id })

      if (profile) {
        if (phone !== undefined) profile.phone = phone
        if (personType !== undefined) profile.personType = personType
        if (cpf !== undefined) profile.cpf = cpf || null
        if (cnpj !== undefined) profile.cnpj = cnpj || null
        await profile.save()
      }
    }

    if (user.role === 'company') {
      const profile = await CompanyProfile.findOne({ user: user._id })

      if (profile) {
        if (phone !== undefined) profile.phone = phone
        await profile.save()
      }
    }

    return res.json({ message: 'Perfil atualizado com sucesso' })
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar perfil', error: error.message })
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Informe a senha atual e a nova senha' })
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: 'A nova senha deve ter pelo menos 6 caracteres' })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Senha atual incorreta' })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    return res.json({ message: 'Senha alterada com sucesso' })
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao alterar senha', error: error.message })
  }
}