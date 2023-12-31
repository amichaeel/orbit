import jwt from 'jsonwebtoken';
import User from '../../../models/User';
import connectToDatabase from '@/lib/mongodb';

export default async function handler(req, res) {
  // Assuming you send the token as a Bearer token in the Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Connect to the database
    let conn = await connectToDatabase();

    // Find the user by decoded userId
    const user = await User.findById(decoded.userId).select('-password'); // exclude password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return some user data (excluding sensitive information like password)
    res.status(200).json({ user });
  } catch (error) {
    // Handle errors, such as token expiration or invalid token
    res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
}
