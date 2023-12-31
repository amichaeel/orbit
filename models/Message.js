import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: {
    type: String, // This will store the encrypted text, not plaintext
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User who sent the message
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId, // Reference to a Channel
    ref: 'Channel',
    required: true,
  },
  nonce: {
    type: String, // Nonce used in the encryption process, if applicable
    required: true, // Make sure every message has a unique nonce for security
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the message creation time
  },
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;