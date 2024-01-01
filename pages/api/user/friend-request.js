import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();

      const { senderUsername, recipientUsername } = req.body;

      if (senderUsername === recipientUsername) {
        return res.status(400).json({ message: "You cannot send a friend request to yourself." });
      }

      const recipient = await User.findOne({ username: recipientUsername });
      if (!recipient) {
        return res.status(404).json({ message: "Recipient user not found" });
      }

      const sender = await User.findOne({ username: senderUsername });
      if (!sender) {
        return res.status(404).json({ message: "Sender user not found" });
      }

      // Check if already friends or request already sent
      if (recipient.friends.includes(senderUsername) || recipient.friendRequests.includes(senderUsername)) {
        return res.status(400).json({ message: "Already friends or request pending" });
      }

      // Add friend request to recipient
      recipient.friendRequests.push(senderUsername);
      await recipient.save();

      // Add outgoing friend request to sender
      sender.outgoingFriendRequests.push(recipientUsername);
      await sender.save();

      res.status(200).json({ message: "Friend request sent" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
