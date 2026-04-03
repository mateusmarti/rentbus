const express = require('express')
const router = express.Router()

const tripController = require('../controllers/tripController')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

router.use(authMiddleware)

router.post('/', roleMiddleware('client'), tripController.createTrip)
router.get('/client', roleMiddleware('client'), tripController.getClientTrips)
router.get('/company', roleMiddleware('company'), tripController.getCompanyTrips)
router.get('/open', roleMiddleware('company', 'admin'), tripController.getOpenTripsForCompanies)

router.get('/:tripId', roleMiddleware('client', 'company', 'admin'), tripController.getTripById)
router.get('/:tripId/payment', roleMiddleware('client', 'company', 'admin'), tripController.getTripPayment)

router.get('/:tripId/proposals', roleMiddleware('client', 'company', 'admin'), tripController.getTripProposals)
router.patch('/proposal/:proposalId/accept', roleMiddleware('client'), tripController.acceptProposal)

router.patch('/:tripId/pay', roleMiddleware('client'), tripController.payTrip)
router.patch('/:tripId/passengers', roleMiddleware('client'), tripController.addPassengers)
router.patch('/:tripId/cancel/client', roleMiddleware('client'), tripController.cancelTripByClient)
router.patch('/:tripId/cancel/company', roleMiddleware('company'), tripController.cancelTripByCompany)
router.patch('/:tripId/allocate', roleMiddleware('company'), tripController.allocateResources)

module.exports = router