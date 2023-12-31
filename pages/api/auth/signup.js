import User from '../../../models/User';
import connectToDatabase from '@/lib/mongodb';
import validatePassword from '@/utils/passwordValidator';
import Channel from '@/models/Channel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // connect to the database
      let conn = await connectToDatabase();
      const { username, password } = JSON.parse(req.body);

      // check if user already exists!
      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ message: "Username already taken" });

      // ensure password meets requirements
      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        // Respond with an error message or messages
        return res.status(400).json({ message: "Password validation failed", errors: passwordErrors });
      }

      // Create a new user with the model and save it
      const defaultChannels = ['orbit', 'global'];
      const user = new User({ username, password, channels: defaultChannels });
      await user.save();

      // Return success message (avoid sending password back)
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: "Method not allowed" });
  }
}
