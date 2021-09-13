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
    const flightOrder = database.collection("flight_order");
    // Query for a movie that has the title 'The Room'
    const options = {
      projection: {
        dictionary: 0,
        flightOffer: {
          itineraries: 0,
          pricingOptions: 0,
          validatingAirlineCodes: 0,
          travelerPricings: 0,
        },
      },
    };
    const sort = { _id: -1 };
    /*  const query = {
      "travelers.name.lastName": { $eq: `${lastName}` },
      "associatedRecords.reference": { $eq: `${reference}` },
    }; */
    const flightOfferData = await flightOrder
      .find({}, options)
      .sort({ _id: -1 })
      .toArray();
    // since this method returns the matched document, not a cursor, print it directly
    // console.log(movie);
    //  console.log(`flightOfferData`, count);
    res.status(200).json(flightOfferData);
  } catch (err) {
    // Ensures that the client will close when you finish/error
    console.log(`err`, err);
  } finally {
    console.log(`closing connection`);
    await client.close();
  }
}
