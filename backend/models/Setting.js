const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    siteName: { type: String, default: 'ZenStore' },
    siteLogo: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: String },
    currencySymbol: { type: String, default: '$' },
    emailJsServiceId: { type: String },
    emailJsTemplateId: { type: String },
    emailJsPublicKey: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
