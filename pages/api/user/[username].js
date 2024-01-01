import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Connect to the database
      await connectToDatabase();

      // Extract the username from the query parameters
      const { username } = req.query;

      // Find the user in the database
      const user = await User.findOne({ username: username });

      // If no user is found, return a 404 error
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return the user data
      res.status(200).json(user);
    } catch (error) {
      // Handle errors in fetching user data
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  } else {
    // Handle any non-GET requests
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
