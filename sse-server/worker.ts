/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />

import { createClient, commandOptions } from "./deps.ts";
import { sql } from "./database.js";
import { Submission } from "./types.ts";
import { ProgrammingAssignmentSubmission } from "./types.ts";

const consumerName = crypto.randomUUID();

const client = createClient({
  url: "redis://redis:6379",
  pingInterval: 1000,
});

const createConsumerGroup = async () => {
  try {
    await client.XGROUP_CREATE("results", "results_group", "0", {
      MKSTREAM: true
    });
    console.log("Created consumer group.");
  } catch (e) {
    console.log("Consumer group already exists, skipped creation.");
  }
};

const readEntryFromStream = async () => {
  const response = await client.XREADGROUP(
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
  return response;
};

self.onmessage = async () => {
  await client.connect();
  await createConsumerGroup();
  
  console.log(`Starting consumer results-${consumerName}.`);

  while (true) {
    try {
      const response = await readEntryFromStream();
  
      if (response) {
        const entryId = response[0].messages[0].id;
        await client.XACK("results", "results_group", entryId);
        console.log(`Acknowledged processing of entry ${entryId}.`);
  
        const resultData = response[0].messages[0].message as unknown as Submission;
        console.log(resultData);
        const { submissionId, feedback } = resultData;

        try {
          const [addedSubmission] = await sql<ProgrammingAssignmentSubmission[]>`
            UPDATE
              programming_assignment_submissions
            SET 
              status='processed',
              grader_feedback=${feedback},
              correct=${feedback.startsWith(".")}
            WHERE
              id=${submissionId}
            RETURNING
              *;
          `;
          self.postMessage(addedSubmission);
          console.log(addedSubmission);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("No new stream entries.");
      }
    } catch (err) {
      console.error(err);
    }
  }
};