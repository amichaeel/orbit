import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';  // Assuming User and Channel schemas are set
import Channel from '../../../models/Channel';

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      await connectToDatabase();

      const { username, userId, channelName, channelId } = req.body;
      // Validate Channel
      const channelValidationResponse = await fetch('http://localhost:3000/api/channels/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channelName }),
      });

      const channelValidationData = await channelValidationResponse.json();

      if (!channelValidationResponse.ok) {
        throw new Error(`Validation API error! status: ${channelValidationResponse.status}`);
      }

      // Check if the channel exists and is public
      if (!channelValidationData.found || !channelValidationData.isPublic) {
        return res.status(404).json({ message: "Channel not found or is not public.", joined: false });
      }

      // Update User's Channel List
      const user = await User.findById(userId);
      if (!user.channels.includes(channelName)) {
        user.channels.push(channelName);
        await user.save();
      } else {
        res.status(500).json({ message: "User is already in channel."})
        console.log('User is already in channel')
      }

      // Update Channel's Member List
      const channel = await Channel.findById(channelId);
      if (!channel.users.includes(username)) {
        channel.users.push(username);
        await channel.save();
      }

      res.status(200).json({ message: "Successfully joined the channel.", joined: true });
    } catch (error) {
      res.status(500).json({ message: `Internal server error: ${error.message}`});
      console.log(error.message)
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
