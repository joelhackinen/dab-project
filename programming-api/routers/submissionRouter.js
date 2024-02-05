import { Router } from "../deps.js";
import { client } from "../app.js";
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
    "code": code,
    "user": state.user,
    "testCode": assignment.test_code,
    "assignment": assignment.assignment_order.toString(),
  };

  await client.XADD("submissions", "*", data);
  return response.status = 200;
});

export default router;