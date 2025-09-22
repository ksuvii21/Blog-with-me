const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/summary', auth, aiController.generateSummary);
router.post('/title', auth, aiController.suggestTitle);
router.post('/tags', auth, aiController.suggestTags);
router.get('/insights', auth, aiController.getInsights);

module.exports = router;
