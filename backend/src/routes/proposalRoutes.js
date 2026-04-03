const express = require('express')
const router = express.Router()

const proposalController = require('../controllers/proposalController')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

router.use(authMiddleware, roleMiddleware('company'))

router.post('/', proposalController.createProposal)
router.get('/mine', proposalController.getCompanyProposals)

module.exports = router