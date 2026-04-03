const express = require('express')
const router = express.Router()

const vehicleController = require('../controllers/vehicleController')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

router.use(authMiddleware, roleMiddleware('company'))

router.post('/', vehicleController.createVehicle)
router.get('/', vehicleController.getVehicles)
router.put('/:id', vehicleController.updateVehicle)
router.delete('/:id', vehicleController.deleteVehicle)

module.exports = router