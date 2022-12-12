exports.handler = function (context, event, callback) {
  const from = "Genesis Care";
  const to = event.From;
  console.log("Incoming event to send invite function", event);

  context
    .getTwilioClient()
    .messages.create({
      to: to,
      from: from,
      body: "Your appointment has been scheduled for 2pm on Wednesday 26th. Remember to complete the intake form by going to https://genesiscare.com/intake",
    })
    .then((msg) => {
      callback(null, msg.sid);
    })
    .catch((err) => callback(err));
};
