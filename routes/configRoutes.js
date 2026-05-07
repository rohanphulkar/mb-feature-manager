const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

router.post('/', configController.getConfig);

module.exports = router;
