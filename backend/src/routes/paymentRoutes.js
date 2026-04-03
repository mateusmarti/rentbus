const express = require('express')
const router = express.Router()

const paymentController = require('../controllers/paymentController')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

router.post('/', authMiddleware, roleMiddleware('admin'), paymentController.createPayment)
router.patch('/:id/confirm', authMiddleware, roleMiddleware('admin'), paymentController.confirmPayment)

module.exports = router