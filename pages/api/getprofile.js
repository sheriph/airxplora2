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
  try {
    await client.connect();
    const database = client.db("airxplora_bookings");
    const settings = database.collection("profile");
    const options = {
      projection: { _id: 0 },
    };
    const query = { profile: { $type: "object" } };

    const profile = await settings.findOne(query, options);

    res.status(200).json(profile);
  } catch (err) {
    console.log(`err`, err);
  } finally {
    console.log(`closing connection`);
    await client.close();
  }
}
