import connectToDatabase from '../../../lib/mongodb';
import Channel from '../../../models/Channel';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();
      const { channelName } = req.body;
      const channelObj = await Channel.findOne({ name: channelName }).exec();
      if (channelObj) {
        const channelId = channelObj._id;
        const isPublic = channelObj.isPublic;
        const users = channelObj.users;
        res.status(201).json({ found: true, id: channelId, isPublic: isPublic, users });
      } else {
        res.status(201).json({ found: false });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}