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

export const findById = async (id) => {
  const [assignment] = await sql`
    SELECT
      *
    FROM
      programming_assignments
    WHERE
      id = ${id}
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
      pas.correct = TRUE
  ;`;

  const nextAssignmentNumber = completedAssignments.reduce((max, a) => (
    a.assignment_order > max
      ? a.assignment_order
      : max
  ), 1);
  
  const [nextAssignment] = await sql`
    SELECT
      ${ sql(columns) }
    FROM
      programming_assignments
    WHERE
      assignment_order = ${nextAssignmentNumber}
  ;`;

  if (nextAssignment) return [...completedAssignments, nextAssignment];
  
  return completedAssignments;
};