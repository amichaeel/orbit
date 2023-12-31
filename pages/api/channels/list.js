import connectToDatabase from '../../../lib/mongodb';
import Channel from '../../../models/Channel';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectToDatabase();

      const channels = await Channel.find();
      res.status(200).json(channels);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
