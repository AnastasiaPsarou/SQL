/*Which movie made the most money?*/

SELECT
    m.name,
    COALESCE(m.revenue, 0) AS revenue --some movies have null revenue
FROM 
    movies m 
WHERE 
    m.revenue = (SELECT MAX(revenue) 
                        FROM movies)
ORDER BY 
    m.revenue DESC;

/*How much revenue did the movies Keanu Reeves act in make?*/

SELECT
    SUM(COALESCE(m.revenue, 0))
FROM 
    movies m
INNER JOIN
    casts c
ON
    m.id=c.movie_id
INNER JOIN
    people p
ON
    p.id = c.person_id
WHERE 
    p.name='Keanu Reeves';


/*Which 5 people were in the movies that had the most revenue?*/

SELECT 
    p.name, SUM(COALESCE(m.revenue, 0)) AS total
FROM 
    movies m
INNER JOIN
    casts c
ON 
    m.id = c.movie_id    
INNER JOIN
    people p
ON
    p.id = c.person_id
GROUP BY 
    p.name, p.id
ORDER BY
    total DESC NULLS LAST
LIMIT 5;                    


/*Which 10 movies have the most keywords?*/
SELECT 
    m.name, m.id, COUNT(c.id) AS count
FROM
    movies m
INNER JOIN 
    movie_keywords mk
ON 
    m.id = mk.movie_id
INNER JOIN
    categories c 
ON 
    c.id = mk.category_id
GROUP BY
    m.name, m.id
ORDER BY 
    count DESC
LIMIT 10;


/*Which category is associated with the most movies*/
SELECT 
    c.id, c.name, COUNT(m.id) AS count
FROM 
    categories c 
INNER JOIN 
    movie_keywords mk
ON 
    c.id = mk.category_id
INNER JOIN
    movies m
ON 
    m.id = mk.movie_id
GROUP BY 
    c.id, c.name
ORDER BY 
    count DESC
LIMIT 1;