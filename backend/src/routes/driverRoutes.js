const express = require('express')
const router = express.Router()

const driverController = require('../controllers/driverController')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

router.use(authMiddleware, roleMiddleware('company'))

router.post('/', driverController.createDriver)
router.get('/', driverController.getDrivers)
router.put('/:id', driverController.updateDriver)
router.delete('/:id', driverController.deleteDriver)

module.exports = router