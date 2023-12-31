import connectToDatabase from '../../../lib/mongodb';
import Message from '../../../models/Message';

export default async function handler(req, res) {
  const { channelId } = req.query; // Get the channel ID from the URL parameter

  try {
    await connectToDatabase();
    // Find messages where 'channel' field equals 'channelId'
    const messages = await Message.find({ channel: channelId }).sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
