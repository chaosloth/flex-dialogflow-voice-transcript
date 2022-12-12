const axios = require("axios");

exports.handler = async (context, event, callback) => {
  const response = new Twilio.Response();
  console.log("Suburb lookup request", event);

  if (!event.lat || !event.lng) {
    const error = "Missing lat lnf";
    response.setBody({ message: error });
    response.setStatusCode(400);
    return callback(null, response);
  }

  const ax = axios.create({
    baseURL: context.GENESISCARE_BASE_URL,
    headers: {
      authority: "genesiscare-prod.ent.eastus2.azure.elastic-cloud.com",
      Authorization: "Bearer " + context.GENESISCARE_TOKEN,
      origin: "https://www.genesiscare.com",
    },
  });

  const uri = context.GENESISCARE_SEARCH_PATH;
  console.log("Genesis Care Locations URI", uri);

  let latLng = event.lat + ", " + event.lng;

  let elastic_qry = {
    page: {
      size: 1000,
      current: 1,
    },
    query: "",
    sort: [
      {
        name: "asc",
      },
    ],
    result_fields: {
      address: {
        raw: {},
      },
      name: {
        raw: {},
      },
      location: {
        raw: {},
      },
      phone: {
        raw: {},
      },
      url: {
        raw: {},
      },
    },
    filters: {
      all: [
        {
          any: [
            {
              location: {
                from: 0,
                to: 10,
                unit: "km",
                center: latLng,
              },
            },
          ],
        },
        {
          all: [
            {
              category_l1: "Service",
            },
          ],
        },
      ],
    },
  };

  const search_response = await ax.post(uri, elastic_qry);
  const data = search_response.data;

  let locations = [];

  data.results.forEach(function (location) {
    let loc = {
      address: location.address.raw,
      phone: location.phone.raw,
      name: location.name.raw,
      location: location.location.raw,
      url: location.url.raw,
      nice: location.name.raw + ", located at, " + location.address.raw,
    };

    locations.push(loc);
  });

  console.log("Search Response", data);
  console.log("Parsed locations", locations);
  return callback(null, locations);
};
