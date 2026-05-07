const express = require('express');
const router = express.Router();
const flagController = require('../controllers/flagController');

router.get('/', flagController.getAllFlags);
router.post('/', flagController.createFlag);
router.put('/:id', flagController.updateFlag);
router.delete('/:id', flagController.deleteFlag);

module.exports = router;
