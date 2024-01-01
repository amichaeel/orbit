import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[a-z0-9-]+$/,  // Only allow alphanumeric characters and hyphens
    maxLength: 15,
  },
  description: {
    type: String,
    required: true,
    maxLength: 150,
  },
  isPublic: {
    type: Boolean,
    default: true,
    required: true,
  },
  isNSFW: {
    type: Boolean,
    default: false,
    required: true,
  },
  users: [{
    type: String,
    ref: 'User',
    required: true,
  }],
  size: {
    type: Number,
    default: 0, 
  },
  flair: [{
    type: String,
  }],
  moderators: [{
    type: String,
    ref: 'User',
  }],
  administrators: [{
    type: String,
    ref: 'User',
    required: true,
  }],
}, { timestamps: true });

const Channel = mongoose.models.Channel || mongoose.model('Channel', channelSchema);

export default Channel;