import User from "../models/user.model.js"

class UserRepository {
    static async createUser(new_user_data) {
        const new_user = new User(new_user_data)
        return await new_user.save()
    }

    static async getUserByEmail(email) {
        return User.findOne({ email: email })
    }

    static async getUserById(userId) {
        return User.findById(userId)
    }

    static async userUpdateByEmail(email, updateData) {
        return User.findOneAndUpdate({ email: email }, updateData)
    }

    static async userUpdateById(userId, updateData) {
        return User.findByIdAndUpdate(userId, updateData)
    }

    static async userDelete(userId) {
        return User.findByIdAndDelete(userId)
    }

}

export default UserRepository
