const path = require("path");
const express = require("express");
const router = express.Router();

// client side static assets
router.get("/", (_, res) => res.sendFile(path.join(__dirname, "./index.html")));
router.get("/client.js", (_, res) =>
  res.sendFile(path.join(__dirname, "./client.js"))
);
router.get("/detail-client.js", (_, res) =>
  res.sendFile(path.join(__dirname, "./detail-client.js"))
);
router.get("/style.css", (_, res) =>
  res.sendFile(path.join(__dirname, "../style.css"))
);
router.get("/detail", (_, res) =>
  res.sendFile(path.join(__dirname, "./detail.html"))
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

router.get("/search", async function (req, res) {
  console.log("search recipes");

  // return recipe_id, title, and the first photo as url
  //
  // for recipes without photos, return url as default.jpg
  const { rows } = await pool.query(`
    SELECT DISTINCT ON (r.recipe_id)
      r.recipe_id,
      r.title,
      COALESCE(rp.url, 'default.jpg') AS url 
    FROM 
      recipes_photos rp
    RIGHT JOIN 
      recipes r 
    ON 
      r.recipe_id = rp.recipe_id;`);   
  

  //res.status(501).json({ status: "not implemented", rows: [] });
  res.json({ rows }).end();
});

router.get("/get", async (req, res) => {
  const recipeId = req.query.id ? +req.query.id : 1;
  console.log("recipe get", recipeId);

  // return all ingredient rows as ingredients
  //    name the ingredient image `ingredient_image`
  //    name the ingredient type `ingredient_type`
  //    name the ingredient title `ingredient_title`
  const ingredientsRes =  pool.query(`
    SELECT
      i.image AS ingredient_image,
      i.type AS ingredient_type,
      i.title AS ingredient_title
    FROM
      ingredients i
    INNER JOIN
      recipe_ingredients ri
    ON 
      i.id = ri.ingredient_id
    WHERE
      ri.recipe_id = $1;`
    ,
    [recipeId]); 

  // return all photo rows as photos
  // return the title, body, and url (named the same)
 
  const photosRes = pool.query(`
    SELECT
      r.title,
      r.body,
      COALESCE(rp.url, 'default.jpg') AS url
    FROM
      recipes_photos rp
    RIGHT JOIN  
      recipes r
    ON
      r.recipe_id = rp.recipe_id
    WHERE 
      r.recipe_id = $1;`,
    [recipeId]); 
  

  // return the title as title
  // return the body as body
  // if no row[0] has no photo, return it as default.jpg

  const [{ rows: photosRows }, { rows: ingredientsRows }] = await Promise.all([
    photosRes,
    ingredientsRes,
  ]);

  res.json({ 
    ingredients: ingredientsRows,
    photos: photosRows.map((photo) => photo.url),
    title: photosRows[0].title,
    body: photosRows[0].body,
  });
});
/**
 * Student code ends here
 */

module.exports = router;
