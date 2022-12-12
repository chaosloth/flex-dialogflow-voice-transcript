const axios = require("axios");

exports.handler = async function (context, event, callback) {
  console.log("Incoming event", event);
  const answerPoint = event.To || "default";
  const response = new Twilio.Response();

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  const ax = axios.create({
    baseURL: context.AIRTABLE_URL,
    headers: { Authorization: "Bearer " + context.AIRTABLE_APIKEY },
  });

  try {
    const qry = encodeURIComponent("{AnswerPoint} = '" + answerPoint + "'");
    const uri = context.AIRTABLE_BASE + "?filterByFormula=" + qry;
    console.log("Airtable URI", uri);
    const air_response = await ax.get(uri);
    let found = false;

    const records = air_response.data.records;
    console.log("Looking for", answerPoint);
    console.log("Airtable records", records);

    if (records && records.length > 0) found = true;

    if (found) {
      response.setBody(records[0].fields);
    } else {
      response.setStatusCode(404);
    }
    callback(null, response);
  } catch (err) {
    response.setStatusCode(500);
    callback(err, response);
  }
};
