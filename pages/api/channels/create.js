import connectToDatabase from '@/lib/mongodb';
import Channel from '@/models/Channel';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();

      const { name, description, isPublic, isNSFW, username } = req.body;
      console.log(req.body);

      // Add validation for the channel name, etc.
      const newChannel = new Channel({ name, description, isPublic, users: [username], isNSFW, administrators: [username] });
      await newChannel.save();

      // add channel to users channels list

      const user = await User.findOneAndUpdate(
        { username: username },  // find the user by username
        { $push: { channels: name } },  // push the new channel's ID to the user's channels array
        { new: true }  // return the updated user object
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(201).json(newChannel);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}