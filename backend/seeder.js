require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        const Product = require('./models/Product');
        const User = require('./models/User');
        const Order = require('./models/Order');

        // Clear existing data
        await Product.deleteMany({});
        await Category.deleteMany({});
        await Order.deleteMany({});
        // Keep users, but ensure at least one admin exists

        const adminEmail = 'hussainjanafridi2@gmail.com';
        let adminUser = await User.findOne({ email: adminEmail });
        if (!adminUser) {
            adminUser = await User.create({
                email: adminEmail,
                name: 'System Admin',
                role: 'admin'
            });
        } else {
            adminUser.role = 'admin';
            await adminUser.save();
        }

        const testUser = await User.findOne({ email: 'test@example.com' });
        let normalUser = testUser;
        if (!testUser) {
            normalUser = await User.create({
                email: 'test@example.com',
                name: 'Test Customer',
                role: 'user'
            });
        }

        // Create Categories
        const categories = await Category.insertMany([
            {
                name: 'Electronics',
                description: 'Next-gen gadgets and digital infrastructure.',
                image: 'https://res.cloudinary.com/demo/image/upload/v1652345767/docs/gadget.jpg'
            },
            {
                name: 'Fashion',
                description: 'Premium apparel designed for the modern matrix.',
                image: 'https://res.cloudinary.com/demo/image/upload/v1652345767/docs/fashion.jpg'
            },
            {
                name: 'Home Design',
                description: 'Minimalist living artifacts and interior ecosystems.',
                image: 'https://res.cloudinary.com/demo/image/upload/v1652345767/docs/interior.jpg'
            }
        ]);

        console.log('Categories seeded!');

        // ... (products remain the same, truncated for brevity in replacement but I will include them)
        const productsData = [
            {
                name: 'ZenBook Pro Matrix',
                price: 1899,
                description: 'Ultra-thin computational matrix with OLED display and neural processing engine.',
                category: categories[0]._id,
                brand: 'ZenTech',
                stock: 15,
                images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop'],
                isFeatured: true,
                ratings: { average: 4.8, count: 124 }
            },
            {
                name: 'Neural Audio Pods',
                price: 249,
                description: 'Spatial audio artifacts with active noise cancellation and 40-hour temporal endurance.',
                category: categories[0]._id,
                brand: 'ZenAudio',
                stock: 45,
                images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop'],
                isFeatured: true,
                isBestSeller: true,
                ratings: { average: 4.9, count: 540 }
            },
            {
                name: 'Heritage Wool Coat',
                price: 599,
                description: 'Fine-tuned textile artifact crafted from sustainable wool matrices.',
                category: categories[1]._id,
                brand: 'ZenWear',
                stock: 20,
                images: ['https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1000&auto=format&fit=crop'],
                isBestSeller: true,
                ratings: { average: 4.7, count: 89 }
            },
            {
                name: 'Minimalist Oak Desk',
                price: 1200,
                description: 'Solid oak workspace interface for high-productivity environments.',
                category: categories[2]._id,
                brand: 'ZenHome',
                stock: 8,
                images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1000&auto=format&fit=crop'],
                isFeatured: true,
                ratings: { average: 4.6, count: 32 }
            },
            {
                name: 'Cyber Quartz Watch',
                price: 850,
                description: 'Precision time-loop tracker with carbon fiber casing and haptic feedback.',
                category: categories[1]._id,
                brand: 'ZenTime',
                stock: 12,
                images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'],
                isFeatured: false,
                isBestSeller: true,
                ratings: { average: 4.5, count: 210 }
            }
        ];

        const createdProducts = await Product.insertMany(productsData);
        console.log('Products seeded!');

        // Create Orders
        const orders = [
            {
                user: normalUser._id,
                orderItems: [
                    {
                        name: createdProducts[0].name,
                        qty: 1,
                        image: createdProducts[0].images[0],
                        price: createdProducts[0].price,
                        product: createdProducts[0]._id
                    }
                ],
                shippingAddress: {
                    address: '123 Matrix St',
                    city: 'Cyber City',
                    postalCode: '10101',
                    country: 'Grid'
                },
                paymentMethod: 'PayPal',
                itemsPrice: createdProducts[0].price,
                taxPrice: (createdProducts[0].price * 0.1).toFixed(2),
                shippingPrice: 10,
                totalPrice: (createdProducts[0].price * 1.1 + 10).toFixed(2),
                isPaid: true,
                paidAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
                isDelivered: true,
                deliveredAt: new Date(),
                orderStatus: 'Delivered'
            },
            {
                user: normalUser._id,
                orderItems: [
                    {
                        name: createdProducts[1].name,
                        qty: 2,
                        image: createdProducts[1].images[0],
                        price: createdProducts[1].price,
                        product: createdProducts[1]._id
                    }
                ],
                shippingAddress: {
                    address: '456 Virtual Ave',
                    city: 'Neon Heights',
                    postalCode: '20202',
                    country: 'Grid'
                },
                paymentMethod: 'Stripe',
                itemsPrice: createdProducts[1].price * 2,
                taxPrice: (createdProducts[1].price * 2 * 0.1).toFixed(2),
                shippingPrice: 0,
                totalPrice: (createdProducts[1].price * 2 * 1.1).toFixed(2),
                isPaid: true,
                paidAt: new Date(),
                orderStatus: 'Processing'
            }
        ];

        await Order.insertMany(orders);
        console.log('Orders seeded!');

        console.log('Database seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error.message);
        process.exit(1);
    }
};

seedData();
