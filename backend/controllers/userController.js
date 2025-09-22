const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const superAdminUsers = await User.countDocuments({ role: 'superadmin' });
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email role createdAt');

    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      totalUsers,
      adminUsers,
      superAdminUsers,
      recentUsers,
      userGrowth
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deletion of superadmin users
    if (user.role === 'superadmin') {
      return res.status(403).json({ message: 'Cannot delete superadmin users' });
    }

    await user.remove();
    res.json({ message: 'User removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.updateUserRole = async (req, res) => {
  const { role } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only superadmins can change roles
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmins can change user roles' });
    }

    // Prevent changing role of superadmin users
    if (user.role === 'superadmin' && role !== 'superadmin') {
      return res.status(403).json({ message: 'Cannot change superadmin role' });
    }

    user.role = role;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.bulkUpdateUsers = async (req, res) => {
  const { userIds, action } = req.body;

  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmins can perform bulk operations' });
    }

    let result;
    switch (action) {
      case 'delete':
        result = await User.deleteMany({
          _id: { $in: userIds },
          role: { $ne: 'superadmin' } // Don't delete superadmins
        });
        break;
      case 'promote_to_admin':
        result = await User.updateMany(
          { _id: { $in: userIds }, role: 'user' },
          { $set: { role: 'admin' } }
        );
        break;
      case 'demote_to_user':
        result = await User.updateMany(
          { _id: { $in: userIds }, role: 'admin' },
          { $set: { role: 'user' } }
        );
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    res.json({
      message: `Bulk ${action} completed`,
      modifiedCount: result.modifiedCount || result.deletedCount
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.getSystemSettings = async (req, res) => {
  try {
    // For now, return mock settings. In production, this could be stored in database
    const settings = {
      platformName: 'MERN Blogging Platform',
      allowRegistration: true,
      requireEmailVerification: false,
      maxBlogsPerUser: 50,
      allowComments: true,
      maintenanceMode: false,
      analyticsEnabled: true
    };

    res.json(settings);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.updateSystemSettings = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmins can update system settings' });
    }

    const { settings } = req.body;

    // In a real application, save to database
    // For now, just return success
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
