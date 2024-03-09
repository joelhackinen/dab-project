import { Router } from "../deps.js";
import { assignmentService, submissionService } from "../util.js";


const router = new Router();

router.get("/assignments", async ({ response, state }) => {
  const assignments = await assignmentService.findAll();
  const submissions = await submissionService.getSubmissionsByUser(state.user);
  const completedSubmissionsIds = submissions.filter(s => s.correct).map(s => s.programming_assignment_id);

  response.body = assignments.map(a => ({ ...a, completed: completedSubmissionsIds.includes(a.id) }));
});

export default router;