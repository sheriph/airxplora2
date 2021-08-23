var Amadeus = require("amadeus");

var amadeus = new Amadeus({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export default async function handler(req, res) {
  console.log("req.method :>> ", req.method, req.body);
  const { airportCode } = req.body;
  try {
    const response = await amadeus.referenceData.locations.get({
      keyword: airportCode,
      subType: Amadeus.location.any,
    });
    res.status(200).json(response.result.data);
  } catch (error) {
    console.log("error :>> ", error);
    throw new Error(error);
  }
}
