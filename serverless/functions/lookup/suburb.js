const axios = require("axios");

exports.handler = async (context, event, callback) => {
  const response = new Twilio.Response();
  console.log("Suburb lookup request", event);

  if (!event.suburb) {
    const error = "Missing suburb";
    response.setBody({ message: error });
    response.setStatusCode(400);
    return callback(null, response);
  }

  const ax = axios.create({
    baseURL: context.OPENCAGE_BASE_URL,
  });

  const qry = encodeURIComponent(event.suburb + ", Australia");
  const uri =
    context.OPENCAGE_GEOCODE_PATH +
    "?key=" +
    context.OPENCAGE_API_KEY +
    "&q=" +
    qry;
  console.log("Open Cage data URI", uri);

  const geocode_response = await ax.get(uri);
  const data = geocode_response.data;

  console.log("Open Cage", data);
  return callback(null, data);
};
