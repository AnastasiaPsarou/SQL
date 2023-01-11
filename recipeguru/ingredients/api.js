const path = require("path");
const express = require("express");
const router = express.Router();

// client side static assets
router.get("/", (_, res) => res.sendFile(path.join(__dirname, "./index.html")));
router.get("/client.js", (_, res) =>
  res.sendFile(path.join(__dirname, "./client.js"))
);

/**
 * Student code starts here
 */

// connect to postgres
const pg = require("pg");
const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "recipeguru",
  password: "lol",
  port: 5432,
});

router.get("/type", async (req, res) => {
  const { type } = req.query;
  console.log("get ingredients", type);

  //we are sanitizing our database by using the $
  //if we had to use more variables we could use $2, $3 etc.

  // return all ingredients of a type
  const { rows } = await pool.query(`SELECT * FROM ingredients WHERE type=$1`, [type]);

  res.json({ rows }).end();
  //res.status(501).json({ status: "not implemented", rows: [] });
});

router.get("/search", async (req, res) => {
  let { term, page } = req.query;
  page = page ? page : 0;
  console.log("search ingredients", term, page);

  let whereClause;
  const params = [page * 5];
  if (term) {
    whereClause = `WHERE CONCAT(title, type) ILIKE $2`;
    params.push(`%${term}%`);
  }
 
  // return all columns as well as the count of all rows as total_count
  // make sure to account for pagination and only return 5 rows at a time
  const { rows } = await pool.query(`SELECT *, COUNT(*) OVER ()::INTEGER AS total_count FROM ingredients ${whereClause} OFFSET $1 LIMIT 5`, params);

  res.json({ rows }).end();
  //res.status(501).json({ status: "not implemented", rows: [] });
});

/**
 * Student code ends here
 */

module.exports = router;