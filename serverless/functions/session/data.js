exports.handler = (context, event, callback) => {
  const response = new Twilio.Response();
  const twilioSyncServiceSid = context.SYNC_SERVICE_SID;
  console.log("Get session data request", event);

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  if (!event.id) {
    const error = "Missing id";
    response.setBody({ message: error });
    response.setStatusCode(400);
    return callback(null, response);
  }

  try {
    let client = context.getTwilioClient();

    console.log("Using Sync service with SID", twilioSyncServiceSid);

    let sessionId = event.id;
    if (sessionId.lastIndexOf("/"))
      sessionId = sessionId.substr(sessionId.lastIndexOf("/") + 1);

    console.log("Looking for doc with ID", event.id);

    client.sync.v1
      .services(twilioSyncServiceSid)
      .documents(sessionId)
      .fetch()
      .then((doc) => {
        console.log("Doc exists", doc);
        response.setBody(doc.data);
        return callback(null, response);
      })
      .catch((error) => {
        console.error(
          "Oh shoot. Something went wrong getting the sync doc:",
          error
        );
        response.setBody({ message: error });
        response.setStatusCode(404);
        return callback(null, response);
      });
  } catch (err) {
    console.error("Ooof. Something went wrong", err);
    response.setBody({ message: err });
    response.setStatusCode(404);
    return callback(null, response);
  }
};
