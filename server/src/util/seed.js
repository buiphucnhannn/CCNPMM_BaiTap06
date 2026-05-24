import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../config/database.js';
import Product from '../model/product.model.js';
import User from '../model/user.model.js';

const BRANDS = ['Nike', 'Adidas', 'Jordan', 'Converse', 'Puma', 'New Balance'];
const CATEGORIES = ['running', 'lifestyle', 'basketball', 'skateboarding', 'training'];

const CATEGORY_NAMES = {
    running: 'Chạy bộ',
    lifestyle: 'Phong cách',
    basketball: 'Bóng rổ',
    skateboarding: 'Trượt ván',
    training: 'Tập luyện'
};

const IMAGE_POOL = [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600181516264-3ea807ff44b9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1588361861040-ac9b1018f6d5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=1200&q=80'
];

const sizesTemplate = [38, 39, 40, 41, 42, 43, 44];

const buildProduct = (brand, category, index) => {
    const basePrice = 1200000 + ((index * 175000) % 5200000);
    const hasSale = index % 3 !== 0;
    const salePrice = hasSale ? Math.round(basePrice * (0.72 + (index % 5) * 0.04)) : null;
    const soldCount = (index * 17) % 500;
    const viewedCount = 200 + ((index * 53) % 5000);
    const tags = [];

    if (index % 4 === 0) tags.push('new');
    if (soldCount > 220) tags.push('best-seller');
    if (hasSale) tags.push('sale');
    if (index % 11 === 0) tags.push('limited');

    const sizes = sizesTemplate.map((size, idx) => ({
        size,
        stock: (index + idx * 3) % 25
    }));

    return {
        name: `${brand} ${CATEGORY_NAMES[category]} ${String(index + 1).padStart(3, '0')}`,
        brand,
        category,
        description: `Mẫu giày ${brand} dành cho phong cách ${CATEGORY_NAMES[category].toLowerCase()}, êm chân, bền bỉ, phù hợp sử dụng hằng ngày và vận động cường độ cao.`,
        price: basePrice,
        salePrice,
        images: [
            IMAGE_POOL[index % IMAGE_POOL.length],
            IMAGE_POOL[(index + 3) % IMAGE_POOL.length]
        ],
        sizes,
        tags: [...new Set(tags)],
        soldCount,
        viewedCount,
        isActive: true
    };
};

const generateProducts = () => {
    const products = [];
    let index = 0;

    for (const category of CATEGORIES) {
        for (const brand of BRANDS) {
            for (let i = 0; i < 16; i++) {
                products.push(buildProduct(brand, category, index));
                index += 1;
            }
        }
    }

    return products;
};

const generateUsers = async () => {
    const passwordHash = await bcrypt.hash('12345678', 10);

    return [
        {
            fullName: 'Quản trị viên',
            email: 'admin@sneakerstore.local',
            password: passwordHash,
            role: 'admin',
            isActive: true,
            phone: '0900000001',
            address: 'Hồ Chí Minh'
        },
        {
            fullName: 'Nguyễn Minh An',
            email: 'an.nguyen@sneakerstore.local',
            password: passwordHash,
            role: 'user',
            isActive: true,
            phone: '0900000002',
            address: 'Đà Nẵng'
        },
        {
            fullName: 'Trần Gia Huy',
            email: 'huy.tran@sneakerstore.local',
            password: passwordHash,
            role: 'user',
            isActive: true,
            phone: '0900000003',
            address: 'Hà Nội'
        },
        {
            fullName: 'Lê Bảo Ngọc',
            email: 'ngoc.le@sneakerstore.local',
            password: passwordHash,
            role: 'user',
            isActive: true,
            phone: '0900000004',
            address: 'Cần Thơ'
        },
        {
            fullName: 'Phạm Quốc Bảo',
            email: 'bao.pham@sneakerstore.local',
            password: passwordHash,
            role: 'user',
            isActive: true,
            phone: '0900000005',
            address: 'Hải Phòng'
        },
        {
            fullName: 'Đỗ Khánh Linh',
            email: 'linh.do@sneakerstore.local',
            password: passwordHash,
            role: 'user',
            isActive: true,
            phone: '0900000006',
            address: 'Nha Trang'
        }
    ];
};

const seedData = async () => {
    await connectDB();

    const products = generateProducts();
    const users = await generateUsers();

    console.log('Đang xóa dữ liệu user và sản phẩm cũ...');
    await User.deleteMany({});
    await Product.deleteMany({});

    console.log(`Đang thêm ${users.length} user mẫu...`);
    await User.insertMany(users);

    console.log(`Đang thêm ${products.length} sản phẩm mới...`);
    await Product.insertMany(products);

    console.log(`Seed thành công: ${users.length} user, ${products.length} sản phẩm.`);
    console.log('Tài khoản mẫu dùng chung mật khẩu: 12345678');
    console.log('Admin: admin@sneakerstore.local');
    await mongoose.connection.close();
};

seedData().catch(async (error) => {
    console.error('Seed thất bại:', error.message);
    await mongoose.connection.close();
    process.exit(1);
});
