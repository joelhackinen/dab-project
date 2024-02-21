import { sql } from "../database/database.js";

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