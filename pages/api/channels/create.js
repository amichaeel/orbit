import connectToDatabase from '../../../lib/mongodb';
import Channel from '../../../models/Channel';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();

      const { name, description, isPublic, username } = req.body;

      // Add validation for the channel name, etc.
      const newChannel = new Channel({ name, description, isPublic, users: [username] });
      await newChannel.save();

      res.status(201).json(newChannel);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}