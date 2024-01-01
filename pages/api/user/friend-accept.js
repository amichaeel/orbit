import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();

      const { senderUsername, accepterUsername } = req.body;

      const acceptor = await User.findOne({ username: accepterUsername });
      if (acceptor) {
        if (!acceptor.friendRequests.includes(senderUsername)) { // Corrected .includes
          return res.status(400).json({ message: 'Recipient did not receive a friend request from sender' });
        } else {
          acceptor.friends.push(senderUsername);
          acceptor.friendRequests = acceptor.friendRequests.filter(request => request !== senderUsername);
          await acceptor.save();
        }
      } else {
        return res.status(404).json({ message: "Recipient user not found" });
      }

      const sender = await User.findOne({ username: senderUsername });
      if (sender) {
        sender.friends.push(accepterUsername);
        sender.outgoingFriendRequests = sender.outgoingFriendRequests.filter(request => request !== accepterUsername);
        await sender.save();
      } else {
        return res.status(404).json({ message: "Sender user not found" });
      }

      res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
