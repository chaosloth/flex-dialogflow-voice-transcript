exports.handler = (context, event, callback) => {
  const response = new Twilio.Response();

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  const twilioSyncServiceSid = context.SYNC_SERVICE_SID;
  console.log("Retrieve document request", event);

  if (!event.dialogFlowId) {
    const error = "Missing dialogFlowId";
    response.setBody({ message: error });
    response.setStatusCode(400);
    return callback(null, response);
  }

  const dialogFlowId = event.dialogFlowId;
  const sessionId = dialogFlowId.substr(dialogFlowId.lastIndexOf("/") + 1);

  try {
    let client = context.getTwilioClient();

    console.log("Using Sync service with SID", twilioSyncServiceSid);
    console.log("Session/Doc Unique ID", sessionId);

    client.sync.v1
      .services(twilioSyncServiceSid)
      .documents(sessionId)
      .fetch()
      .then((doc) => {
        console.log("Doc exists", doc);
        return callback(null, doc);
      })
      .catch((error) => {
        console.error("Oh shoot. Something went wrong getting the sync doc:");
        response.setBody({ message: error.message });
        response.setStatusCode(404);
        return callback(null, response);
      });
  } catch (err) {
    return callback(err);
  }
};
