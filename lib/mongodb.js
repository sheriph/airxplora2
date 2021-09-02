import { MongoClient } from "mongodb";

export const getMongo = async () => {
  const uri =
    "mongodb+srv://sheriph:KuOEsCp5ZEGLIomH@airxploradb.gsw1b.mongodb.net/airxploraDb?retryWrites=true&w=majority";
  const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  };
  // @ts-ignore
  const client = new MongoClient(uri, options);

  //let client;
  //let clientPromise;
  /* 
  if (!uri) {
    throw new Error("Please add your Mongo URI to .env.local");
  }

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      // @ts-ignore
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    // @ts-ignore
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
 */
  //console.log(`clientPromise`, clientPromise);
  // Export a module-scoped MongoClient promise. By doing this in a
  // separate module, the client can be shared across functions.
  //export default clientPromise;

  try {
    await client.connect();
    const database = client.db("sample_mflix");
    const movies = database.collection("movies");
    // Query for a movie that has the title 'Back to the Future'
    const query = { title: "Back to the Future" };
    const movie = await movies.findOne(query);
    console.log(movie);
    return movie;
    // res.status(200).json(movie);
  } catch (err) {
    // Ensures that the client will close when you finish/error
    console.log(`err`, err);
    await client.close();
    return null;
  }
};
