import { serve } from "./deps.js";
import { grade } from "./services/gradingService.js";

const handleRequest = async (request) => {
  // the starting point for the grading api grades code following the
  // gradingDemo function, but does not e.g. use code from the user
  const requestData = await request.json();

  console.log("Request data:");
  console.log(requestData);

  const code = requestData.code;
  const testCode = requestData.testCode;

  const result = await grade(code, testCode);

  // in practice, you would either send the code to grade to the grader-api
  // or use e.g. a message queue that the grader api would read and process

  return new Response(JSON.stringify({ result: result }));
};

const portConfig = { port: 7000, hostname: "0.0.0.0" };
serve(handleRequest, portConfig);
