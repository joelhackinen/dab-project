import { Router } from "../deps.js";
import { getAvailableAssignments } from "../services/assignmentService.js";


const router = new Router();

router.get("/assignments", async ({ response, state }) => {
  const availableAssignments = await getAvailableAssignments(state.user);
  return response.body = availableAssignments;
});

export default router;