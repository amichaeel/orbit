import connectToDatabase from '@/lib/mongodb';
import Message from '@/models/Message';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();
      const { content, userId, username, nonce, channel } = req.body;
      // ensure all required fields are provided
      if (!content || !userId || !nonce || !channel || !username) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // ensure username matches with user_id
      const userExists = await User.exists({ _id: userId, username: username });
      if (userExists) {
        const newMessage = new Message({ content, user: userId, username: username, nonce, channel }); // Assuming default channel for now
        await newMessage.save();
        res.status(201).json(newMessage);
      } else {
        res.status(400).json({ message: 'User does not exist.' })
      }

    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
