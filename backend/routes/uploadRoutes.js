const express = require('express');
const multer = require('multer');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

const storage = multer.memoryStorage();

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only! (jpg, jpeg, png, webp)'));
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// @desc    Upload an image to Cloudinary
// @route   POST /api/uploads
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await uploadToCloudinary(req.file.buffer);
        res.json({
            image: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        res.status(500).json({ message: 'Cloudinary upload failed' });
    }
});

// @desc    Delete an image from Cloudinary
// @route   DELETE /api/uploads/:public_id
// @access  Private/Admin
router.delete('/:public_id', protect, admin, async (req, res) => {
    try {
        const { public_id } = req.params;
        const result = await deleteFromCloudinary(public_id);
        res.json({ message: 'Image deleted', result });
    } catch (error) {
        console.error('Cloudinary Delete Error:', error);
        res.status(500).json({ message: 'Cloudinary delete failed' });
    }
});

module.exports = router;
