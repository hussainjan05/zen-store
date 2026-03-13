const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a buffer to Cloudinary
 * @param {Buffer} buffer 
 * @param {String} folder 
 * @returns {Promise<Object>}
 */
const uploadToCloudinary = (buffer, folder = 'pos-web') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
            },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

/**
 * Delete an image from Cloudinary
 * @param {String} publicId 
 * @returns {Promise<Object>}
 */
const deleteFromCloudinary = (publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};

module.exports = {
    cloudinary,
    uploadToCloudinary,
    deleteFromCloudinary,
};
