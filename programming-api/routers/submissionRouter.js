import { Router } from "../deps.js";
import { client } from "../app.js";
import * as assignmentService from "../services/assignmentService.js";
import * as submissionService from "../services/submissionService.js";

const router = new Router();

router.post("/submissions", async ({ request, response, state }) => {
  const body = request.body({ type: "json" });
  const { assignmentNumber, code } = await body.value;

  const pendingSubmissionsExist = await submissionService.checkForPendingSubmissions(state.user);
  if (pendingSubmissionsExist) {
    console.log("user has pending submissions");
    return response.status = 400;
  }

  const assignment = await assignmentService.findByNumber(assignmentNumber);

  if (!assignment) {
    response.body = { error: "invalid assignment number" };
    return response.status = 400;
  }
  
  const { id: assignmentId, test_code } = assignment;

  const newSubmission = await submissionService.postSubmission(
    assignmentId,
    code,
    state.user,
  );

  const similarSubmission = await submissionService.findSimilar(assignmentId, code);

  if (similarSubmission) {
    console.log("Similar submission found");
    const resultObject = {
      code,
      feedback: similarSubmission.grader_feedback,
      submissionId: newSubmission.id.toString(),
      user: state.user
    };

    await client.XADD("results", "*", resultObject);
    return response.status = 200;
  }

  console.log("No similar submissions found");

  const data = {
    code,
    user: state.user,
    testCode: test_code,
    submissionId: newSubmission.id.toString(),
  };

  await client.XADD("submissions", "*", data);
  return response.status = 200;
});

export default router;