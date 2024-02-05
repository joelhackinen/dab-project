import { createClient, commandOptions } from "./deps.js";
import { grade } from "./services/gradingService.js";

const consumerName = crypto.randomUUID();

const client = createClient({
  url: "redis://redis:6379",
  pingInterval: 1000,
});

await client.connect();

try {
  await client.XGROUP_CREATE("submissions", "submissions_group", "0", {
    MKSTREAM: true
  });
  console.log("Created consumer group.");
} catch (e) {
  console.log("Consumer group already exists, skipped creation.");
}

console.log(`Starting consumer submissions-${consumerName}.`);

while (true) {
  try {
    let response = await client.XREADGROUP(
      commandOptions({
        isolated: true
      }),
      "submissions_group", 
      consumerName, [
        {
          key: "submissions",
          id: '>',
        },
      ], {
        COUNT: 1,
        BLOCK: 5000
      },
    );

    if (response) {
      /*
      Response is an array of streams, each containing an array of entries:
      [
       {
          "name": "mystream",
          "messages": [
            {
              "id": "1642088708425-0",
              "message": {
                "key": "value"
              }
            }
          ]
        }
      ]
      */
      const entryId = response[0].messages[0].id;
      await client.XACK("submissions", "submissions_group", entryId);
      console.log(`Acknowledged processing of entry ${entryId}.`);

      const submissionData = response[0].messages[0].message;
      console.log(submissionData);
      const { code, testCode, assignment, user } = submissionData;

      const result = await grade(code, testCode);

      const resultObject = {
        code,
        result,
        assignment,
        user
      };
      console.log(resultObject);

      await client.XADD("results", "*", resultObject);
    } else {
      console.log("No new stream entries.");
    }
  } catch (err) {
    console.error(err);
  }
}