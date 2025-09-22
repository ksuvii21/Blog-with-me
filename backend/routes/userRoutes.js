const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

const superAdminAuth = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Superadmin access required' });
  }
  next();
};

// Public routes (if needed)
router.get('/stats', auth, adminAuth, userController.getUserStats);

// Admin routes
router.get('/', auth, adminAuth, userController.getUsers);
router.put('/:id/role', auth, superAdminAuth, userController.updateUserRole);
router.delete('/:id', auth, adminAuth, userController.deleteUser);

// Superadmin only routes
router.post('/bulk-update', auth, superAdminAuth, userController.bulkUpdateUsers);
router.get('/settings', auth, superAdminAuth, userController.getSystemSettings);
router.put('/settings', auth, superAdminAuth, userController.updateSystemSettings);

module.exports = router;
