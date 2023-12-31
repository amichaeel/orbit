import connectToDatabase from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    let conn = await connectToDatabase();
    res.status(200).json({ message: 'successfully connected to database' });
  } catch (e) {
    console.error('database connection failed', e);
    res.status(500).json({ message: 'failed to connect to the database' });
  }
}