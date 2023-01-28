import type { Serverless } from "serverless/aws";

const serverlessConfiguration: Serverless = {
  service: "mockingbird",
  frameworkVersion: "3",
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    versionFunctions: false,
  },
  custom: {
    customDomain: {
      domainName: "${env:MOCKINGBIRD_DOMAIN}",
      endpointType: "regional",
      apiType: "http",
    },
  },
  package: {
    patterns: [
      "!.git/**",
      "!node_modules/.cache/**",
      "!node_modules/**/@types/**",
      "!*.png",
      "!*.md",
    ],
  },
  functions: {
    api: {
      handler: "handler.handler",
      events: [
        {
          httpApi: {
            method: "*",
            path: "*",
          },
        },
      ],
    },
  },
  plugins: ["serverless-domain-manager", "serverless-offline"],
  useDotenv: true,
};

module.exports = serverlessConfiguration;
