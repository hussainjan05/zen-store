// Script to make a user admin
const mongoose = require('mongoose');
require('dotenv').config();

const email = process.argv[2] || 'hussainjanafridi2@gmail.com';

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pos-web')
    .then(async () => {
        const result = await mongoose.connection.db.collection('users').updateOne(
            { email: email },
            { $set: { role: 'admin' } }
        );
        if (result.matchedCount > 0) {
            console.log(`✅ User "${email}" is now ADMIN!`);
        } else {
            console.log(`❌ User "${email}" not found. Please login first to create your account.`);
        }
        process.exit(0);
    })
    .catch(err => {
        console.error('DB Error:', err);
        process.exit(1);
    });
