import { MongoClient } from "mongodb";
import { uniqueId } from "lodash";
const uri = process.env.MONGODB_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

// @ts-ignore

const client = new MongoClient(uri, options);

export default async function handler(req, res) {
  console.log(`req.body`, req.body);
  try {
    await client.connect();
    const database = client.db("airxplora_bookings");
    const settings = database.collection("settings");
    const replacement = req.body;
    const query = { commission: { $type: "array" } };
    const result = await settings.replaceOne(query, replacement);
    res.status(200).json(result.acknowledged);
  } catch (err) {
    console.log(`err`, err);
  } finally {
    console.log(`closing connection`);
    await client.close();
  }
}
