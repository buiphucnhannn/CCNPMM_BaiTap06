import User from '../model/user.model.js';

class UserRepository {
    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findById(userId) {
        return await User.findById(userId).select('-password');
    }

    async updateUserByEmail(email, updateData) {
        return await User.findOneAndUpdate({ email }, updateData, { new: true });
    }

    async updateUserById(userId, updateData) {
        return await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    }

    // Khởi tạo user mới vào Database
    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async deleteByEmail(email) {
        return await User.deleteOne({ email });
    }
}

export default new UserRepository();
