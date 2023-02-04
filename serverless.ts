import type { Serverless } from "serverless/aws";

const serverlessConfiguration: Serverless = {
  org: "hdm",
  app: "mockoon",
  service: "mockingbird",
  frameworkVersion: "3",
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    versionFunctions: false,
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
  plugins: ["serverless-offline"],
  useDotenv: true,
};

module.exports = serverlessConfiguration;
