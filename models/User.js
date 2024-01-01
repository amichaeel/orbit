import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxLength: 15,
    minLength: 3,
  },
  password: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    maxLength: 65
  },
  channels: [{
    type: String,
    ref: 'Channel',
  }],
  friends: [{
    type: String,
    ref: 'User',
  }],
  friendRequests: [{
    type: String,
    ref: 'User',
  }],
  outgoingFriendRequests: [{
    type: String,
    ref: 'User',
  }],
  followers: [{
    type: String,
    ref: 'User',
  }],
  following: [{
    type: String,
    ref: 'User',
  }],
  isPublic: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// pre-save hook to hash password before saving the user document
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
