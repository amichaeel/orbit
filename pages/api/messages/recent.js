import connectToDatabase from '../../../lib/mongodb';
import Message from '../../../models/Message';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectToDatabase();

      // Fetch the last 50 messages from the global channel
      const recentMessages = (await Message.find().sort({ createdAt: -1 }).limit(50));

      res.status(200).json(recentMessages);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
