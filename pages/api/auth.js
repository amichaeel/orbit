import connectToDB from "@/lib/mongodb";

export default async function handler(req, res) {
  const db = await connectToDB();
}