import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectToDatabase();

      const { senderUserID, recipientUsername } = req.body;

      const user = await User.findOne({_id: senderUserID})

      if (user.username != recipientUsername) {
        return res.status(500).json({ message: 'Only the user can view their friend requests'})
      }
      return res.status(200).json({ friendRequests: user.friendRequests });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
