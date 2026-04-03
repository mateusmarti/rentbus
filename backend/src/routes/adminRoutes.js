const express = require('express')
const router = express.Router()

const adminController = require('../controllers/adminController')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

router.use(authMiddleware, roleMiddleware('admin'))

router.get('/overview', adminController.getOverview)

router.post('/users', adminController.createUser)
router.put('/users/:id', adminController.updateUser)
router.delete('/users/:id', adminController.deleteUser)

router.post('/companies', adminController.createCompany)
router.put('/companies/:id', adminController.updateCompany)
router.delete('/companies/:id', adminController.deleteCompany)

router.post('/trips', adminController.createTrip)
router.put('/trips/:id', adminController.updateTrip)
router.delete('/trips/:id', adminController.deleteTrip)
router.patch('/trips/:id/mark-paid', adminController.markTripAsPaid)

module.exports = router