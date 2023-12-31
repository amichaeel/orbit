import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    maxLength: 150,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  users: [{
    type: String,
    ref: 'User'
  }],
}, { timestamps: true });

const Channel = mongoose.models.Channel || mongoose.model('Channel', channelSchema);
export default Channel;
