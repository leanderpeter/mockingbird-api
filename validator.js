const environments = require("./environments.json");
const requiredProperties = ["path", "prefix"];

let foundError = false;
let prefixes = new Set();

console.log("Validating environments.json file...\n");

environments.forEach((environment, environmentIndex) => {
  let propertyMissing = false;
  // Has all required properties
  requiredProperties.forEach((property) => {
    if (!Object.hasOwn(environment, property)) {
      console.error(
        `Error: Environment ${environmentIndex} needs the '${property}' property.`
      );
      foundError = true;
      propertyMissing = true;
    }
  });
  if (propertyMissing) {
    return;
  }

  const data = require(environment["path"]);

  // Has a recent version
  if (data["lastMigration"] < 25) {
    console.error(
      `Error: Environment ${environmentIndex} needs to have a Mockoon migration version >= 25 (Mockoon version >= 1.22.0). Please upgrade to the latest version of Mockoon and import the environment file again.`
    );
    foundError = true;
  }

  // Has a prefix
  if (!Object.hasOwn(data, "endpointPrefix") || !data["endpointPrefix"]) {
    console.error(
      `Error: Environment ${environmentIndex} needs to have a prefix defined in the "endpointPrefix" property.`
    );
    foundError = true;
  }

  // Prefix in environment file and environments.json matches
  if (data["endpointPrefix"] !== environment["prefix"]) {
    console.error(
      `Error: Prefix in environment ${environmentIndex}'s environment file ('${data["endpointPrefix"]}') needs to match prefix in environments.json ('${environment["prefix"]}').`
    );
    foundError = true;
  }

  // Prefix is unique
  if (prefixes.has(environment["prefix"])) {
    console.error(`Error: Prefix '${environment["prefix"]}' must be unique.`);
    foundError = true;
  }

  prefixes.add(environment["prefix"]);
});

if (foundError) {
  // Exit with non-zero status code if any errors were found.
  console.log(
    "\nPlease fix the above errors before deploying the Mockoon functions to Lambda."
  );
  process.exit(1);
}
