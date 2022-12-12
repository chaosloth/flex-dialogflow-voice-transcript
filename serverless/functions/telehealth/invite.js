exports.handler = function (context, event, callback) {
  console.log("Incoming event to send invite function", event);

  if (!event.request || !event.request.headers || !event.request.headers.from) {
    callback("Missing phone number");
    return;
  }
  context
    .getTwilioClient()
    .messages.create({
      to: event.request.headers.from,
      from: "+61488882137",
      body: "Start your virtual appointment now following this link https://twilio.com/care",
    })
    .then((msg) => {
      callback(null, msg.sid);
    })
    .catch((err) => callback(err));
};
