import { Router } from "../deps.js";
import { findAll } from "../services/assignmentService.js";
import { getSubmissionsByUser } from "../services/submissionService.js";


const router = new Router();

router.get("/assignments", async ({ response, state }) => {
  const assignments = await findAll();
  const submissions = await getSubmissionsByUser(state.user);
  const completedSubmissionsIds = submissions.filter(s => s.correct).map(s => s.programming_assignment_id);

  response.body = assignments.map(a => ({ ...a, completed: completedSubmissionsIds.includes(a.id) }));
});

export default router;