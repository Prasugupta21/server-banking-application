const express = require('express');
const router = express.Router();
const {userVerification} =require('../middleware/user')

const { deposit, withdraw ,transfer,getHistory} = require('../controllers/transaction');

router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.post('/transfer', transfer);
router.get('/history',userVerification,getHistory);
module.exports = router;
