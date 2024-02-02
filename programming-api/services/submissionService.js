import { sql } from "../database/database.js";

export const getSubmissionsByUser = async () => {
  const rows = await sql`
    SELECT
      *
    FROM
      programming_assignment_submissions
    WHERE
      user_uuid
  ;`;
  return rows;
};

export const getNextAssignmentByUser = async (user_uuid) => {
  /// TODO
};