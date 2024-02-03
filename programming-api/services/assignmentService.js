import { sql } from "../database/database.js";

const columns = ["title", "assignment_order", "handout"];

export const findAll = async () => {
  return await sql`
    SELECT
      *
    FROM
      programming_assignments
  ;`;
};

export const findByNumber = async (number) => {
  const [assignment] = await sql`
    SELECT
      *
    FROM
      programming_assignments
    WHERE
      assignment_order = ${number}
  ;`;
  return assignment;
};

export const getAvailableAssignments = async (user_uuid) => {
  const completedAssignments = await sql`
    SELECT
      ${ sql(columns) }
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

  const nextAssignmentNumber = completedAssignments.reduce((max, obj) => (
    obj.assignment_order > max
      ? obj.assignment_order
      : max
  ), 0);
  
  const nextAssignment = await sql`
    SELECT
      ${ sql(columns) }
    FROM
      programming_assignments
    WHERE
      assignment_order = ${nextAssignmentNumber}
  ;`;
  
  return [completedAssignments, ...nextAssignment];
};