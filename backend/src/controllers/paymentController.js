const Payment = require('../models/Payment')
const Trip = require('../models/Trip')

exports.createPayment = async (req, res) => {
  try {
    const { tripId, amount, paymentMethod } = req.body

    const payment = await Payment.create({
      trip: tripId,
      amount,
      paymentMethod
    })

    await Trip.findByIdAndUpdate(tripId, {
      status: 'awaiting_payment'
    })

    res.status(201).json(payment)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar pagamento' })
  }
}

exports.confirmPayment = async (req, res) => {
  try {
    const { id } = req.params

    const payment = await Payment.findByIdAndUpdate(
      id,
      {
        status: 'paid',
        paidAt: new Date()
      },
      { new: true }
    )

    if (!payment) {
      return res.status(404).json({ message: 'Pagamento não encontrado' })
    }

    await Trip.findByIdAndUpdate(payment.trip, {
      status: 'preparing_trip'
    })

    res.json(payment)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao confirmar pagamento' })
  }
}