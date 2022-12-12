exports.handler = async (context, event, callback) => {
  const response = new Twilio.Response();
  const twilioSyncServiceSid = context.SYNC_SERVICE_SID;
  console.log("Incoming event to store document", event);

  if (!event.sessionInfo || !event.sessionInfo.session) {
    const error = "Missing dialogflow session data";
    response.setBody({ message: error });
    response.setStatusCode(400);
    return callback(null, response);
  }

  const dialogFlowId = event.sessionInfo.session;
  const sessionId = dialogFlowId.substr(dialogFlowId.lastIndexOf("/") + 1);
  const client = context.getTwilioClient();

  console.log("Using Sync service with SID", twilioSyncServiceSid);
  console.log("Session/Doc Unique ID", sessionId);

  let needToCreate = true;

  try {
    // Check if doc exists and update
    await client.sync.v1
      .services(twilioSyncServiceSid)
      .documents(sessionId)
      .fetch()
      .then((doc) => {
        console.log("Doc exists, updating");
        needToCreate = false;

        // Document exists, update it
        client.sync.v1
          .services(twilioSyncServiceSid)
          .documents(sessionId)
          .update({ data: event })
          .then((doc) => {
            return callback(null, { document: doc.sid });
          })
          .catch((error) => {
            console.error(
              "Oh shoot. Something went wrong updating the existing sync doc:"
            );
            console.error(error.message);
          });
      })
      .catch((error) => {
        console.error("Oh shoot. Something went wrong getting the sync doc:");
        console.error(error.message);
      });

    // Document does NOT existing, create it
    if (needToCreate) {
      client.sync.v1
        .services(twilioSyncServiceSid)
        .documents.create({ uniqueName: sessionId, data: event })
        .then((doc) => {
          console.log("Document created with SID", doc.sid);
          return callback(null, { document: doc.sid });
        })
        .catch((error) => {
          console.error("Oh shoot. Something went wrong creating the doc:");
          console.error(error.message);
        });
    }
  } catch (err) {
    return callback(err);
  }
};
