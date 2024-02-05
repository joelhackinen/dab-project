import { createClient, commandOptions } from "./deps.js";

const consumerName = crypto.randomUUID();

const client = createClient({
  url: "redis://redis:6379",
  pingInterval: 1000,
});

self.onmessage = async () => {
  await client.connect();

  try {
    await client.XGROUP_CREATE("results", "results_group", "0", {
      MKSTREAM: true
    });
    console.log("Created consumer group.");
  } catch (e) {
    console.log("Consumer group already exists, skipped creation.");
  }
  
  console.log(`Starting consumer results-${consumerName}.`);

  while (true) {
    try {
      let response = await client.XREADGROUP(
        commandOptions({
          isolated: true
        }),
        "results_group", 
        consumerName, [
          {
            key: "results",
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
        await client.XACK("results", "results_group", entryId);
        console.log(`Acknowledged processing of entry ${entryId}.`);
  
        const resultData = response[0].messages[0].message;
        self.postMessage(resultData);
      } else {
        console.log("No new stream entries.");
      }
    } catch (err) {
      console.error(err);
    }
  }
};