require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudinary() {
    try {
        console.log('Testing Cloudinary with Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
        const result = await cloudinary.api.ping();
        console.log('Cloudinary Connection: SUCCESS', result);
    } catch (error) {
        console.error('Cloudinary Connection: FAILED', error.message);
    }
}

testCloudinary();
