const mockoon = require("@mockoon/serverless");

const environments = require("./environments.json");

module.exports.handler = async function (event, context, callback) {
  let path = event["requestContext"]["http"]["path"];
  console.log(`Received request for path: ${path}`);
  let environmentMatch = null;

  environments.every((environment) => {
    if (
      path === environment["prefix"] ||
      path.startsWith("/" + environment["prefix"] + "/")
    ) {
      console.log(
        `\nFound Mockoon environment for prefix: ${environment["prefix"]}\n`
      );
      environmentMatch = environment;
      return false;
    }
    return true;
  });

  if (environmentMatch) {
    const mockEnv = require(environmentMatch["path"]);
    const mockoonServerless = new mockoon.MockoonServerless(mockEnv);
    return mockoonServerless.awsHandler()(event, context);
  } else {
    console.log(`No Mockoon environment found for path: ${path}`);
    callback(`[NotFound] Route not found: '${path}'`);
  }
};
