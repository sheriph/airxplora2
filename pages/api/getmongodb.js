import { MongoClient } from "mongodb";
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
    const database = client.db("sample_mflix");
    const movies = database.collection("movies");
    // Query for a movie that has the title 'Back to the Future'
    const query = { title: "Back to the Future" };
    const movie = await movies.findOne(query);
    //console.log(movie);
    res.status(200).json(movie);
  } catch (err) {
    // Ensures that the client will close when you finish/error
    console.log(`err`, err);
  } finally {
    console.log(`I am running`);
    await client.close();
  }
  //  run().catch(console.dir);
}
