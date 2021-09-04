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
  const { data, db, col } = req.body;
  console.log(`data`, data, db, col);
  try {
    await client.connect();
    const database = client.db(db);
    const flight_order = database.collection(col);
    const result = await flight_order.insertOne(data);
    res.status(200).json(result);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } catch (err) {
    // Ensures that the client will close when you finish/error
    console.log(`err`, err);
  } finally {
    console.log(`closing connection`);
    await client.close();
  }
}
