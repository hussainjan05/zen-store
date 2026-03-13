const Setting = require('../models/Setting');

/**
 * @desc    Get site settings
 * @route   GET /api/settings
 * @access  Public
 */
const getSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            settings = await Setting.create({});
        }
        res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Update site settings
 * @route   PUT /api/settings
 * @access  Private/Admin
 */
const updateSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            settings = await Setting.create(req.body);
        } else {
            Object.assign(settings, req.body);
            await settings.save();
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
