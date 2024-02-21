export interface Submission {
  code: string;
  feedback: string;
  submissionId: string;
  user: string;
}

export interface ProgrammingAssignmentSubmission {
  id: number;
  programming_assignment_id: number;
  code: string;
  user_uuid: string;
  status: string;
  grader_feedback: string;
  correct: boolean;
  last_updated: string;
}