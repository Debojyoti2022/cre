const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  credits: { type: Number, default: 0 },
  savedPosts: [postSchema],
  lastLoginDate: { type: Date },
  profileCompleted: { type: Boolean, default: false },
});

userSchema.methods.checkProfileCompletion = async function() {
  if (this.name && this.bio) {
    this.profileCompleted = true;
    await this.save();
    return true;
  }
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
