import { Router } from "../deps.js";
import * as assignmentService from "../services/assignmentService.js";

const router = new Router();

router.post("/submissions", async ({ request, response, state }) => {
  const body = request.body({ type: "json" });
  const { assignmentNumber, code } = await body.value;

  const assignment = await assignmentService.findByNumber(assignmentNumber);

  if (!assignment) {
    response.body = { error: "invalid assignment number" };
    return response.status = 400;
  }

  const data = {
    code,
    user: state.user,
    testCode: assignment.testCode,
    assignment: assignment.assignment_order,
  };

  const graderResponse = await fetch("http://grader-api:7000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const graderData = await graderResponse.json();
  return response.body = graderData;
});

export default router;