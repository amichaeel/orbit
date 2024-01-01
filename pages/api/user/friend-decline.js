import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();

      const { senderUsername, recipientUsername } = req.body;

      const recipient = await User.findOne({ username: recipientUsername });
      if (recipient) {
        recipient.friendRequests = recipient.friendRequests.filter(request => request !== senderUsername); // Remove the sender from friendRequests
        await recipient.save();
      }

      const sender = await User.findOne({ username: senderUsername });
      if (sender) {
        sender.outgoingFriendRequests = sender.outgoingFriendRequests.filter(request => request !== recipientUsername); // Remove the accepter from outgoingFriendRequests
        await sender.save();
      }

      res.status(200).json({ message: "Friend request declined" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
