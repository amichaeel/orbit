import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
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
