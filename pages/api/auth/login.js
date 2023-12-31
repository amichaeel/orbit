import User from '../../../models/User';
import connectToDatabase from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Connect to the database
      await connectToDatabase();

      // Destructure username and password from request body
      const { username, password } = JSON.parse(req.body);

      // Check if user exists
      const user = await User.findOne({ username });
      if (!user) {
        console.log(`no user exists with that username: ${username}`)
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Check if password matches
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        console.log('no match found')
        return res.status(400).json({ message: "Invalid credentials" });
      }

      console.log(`match found: ${isMatch}`);

      // Generate JWT Token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      // Return the token
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: "Method not allowed" });
  }
}
