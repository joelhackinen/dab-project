import { sql } from "../database/database.js";

export const postSubmission = async (assignmentId, code, user) => {
  const [addedSubmission] = await sql`
    INSERT INTO programming_assignment_submissions
      (programming_assignment_id, code, user_uuid)
    VALUES (
      ${assignmentId},
      ${code},
      ${user}
    ) RETURNING *;
  `;
  return addedSubmission;
};

export const findSimilar = async (assignmentId, code) => {
  const [row] = await sql`
    SELECT
      *
    FROM (
      SELECT
        *
      FROM
        programming_assignment_submissions
      WHERE
        programming_assignment_id=${assignmentId}
          AND
        code=${code}
    ) AS subquery
    WHERE
      status='processed'
  ;`;
  return row;
};

export const getSubmissionsByUser = async (user_uuid) => {
  const rows = await sql`
    SELECT
      *
    FROM
      programming_assignment_submissions
    WHERE
      user_uuid=${user_uuid}
  ;`;
  return rows;
};

export const checkForPendingSubmissions = async (user_uuid) => {
  const [{ count }] = await sql`
    SELECT
      COUNT(*)
    FROM
      programming_assignment_submissions
    WHERE
      user_uuid=${user_uuid}
        AND
      status='pending'
  ;`;
  return count;
};

export const getNextAssignmentByUser = async (user_uuid) => {
  const [{ next_assignment_number }] = await sql`
    SELECT
      COALESCE(MAX(pa.assignment_order) + 1, 1) AS next_assignment_number
    FROM
      programming_assignments pa
    JOIN
      programming_assignment_submissions pas ON pa.id = pas.programming_assignment_id
    WHERE
      pas.user_uuid = ${user_uuid}
        AND
      pas.status = 'processed'
        AND
      pas.correct = TRUE
  ;`;
  return next_assignment_number;


};