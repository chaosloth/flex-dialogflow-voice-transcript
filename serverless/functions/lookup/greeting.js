const axios = require("axios");

exports.handler = async function (context, event, callback) {
  console.log("Dynamic greeting - Incoming event", event);
  const answerPoint = event.request.headers.to || "default";
  const response = new Twilio.Response();

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

    let welcome_start = ".";

    if (found) {
      welcome_start = records[0].fields.LocationName;
    }

    var dfResponse = {
      fulfillment_response: {
        messages: [
          {
            text: {
              text: [welcome_start],
            },
          },
        ],
      },
    };

    // response.setBody(dfResponse);
    console.log("Responding with", JSON.stringify(dfResponse, null, 2));

    return callback(null, dfResponse);
  } catch (err) {
    response.setStatusCode(500);
    return callback(err, response);
  }
};
