const UserModel = require("../models/userModel");
const User = require("../oop/OOP");

class UserService {
  static async createUser(data) {
    const doc = await UserModel.create(data);
    return new User(doc._id, doc.name, doc.email, doc.contact, doc.notifications);
  }

  static async getAllUsers() {
    const docs = await UserModel.find();
    return docs.map(d => new User(d._id, d.name, d.email, d.contact, d.notifications));
  }
}

module.exports = UserService;
