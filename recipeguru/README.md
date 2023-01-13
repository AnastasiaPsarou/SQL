recipes.sql is the data that was used for the implementation of the website.

The queries that were implemented are inside recipes/app.js and ingredients/app.js.

Docker was used:  
* docker pull postgres:14
* docker pull btholt/complete-intro-to-sql
* docker run -e POSTGRES_PASSWORD=lol --name=pg --rm -d -p 5432:5432 postgres:14
* docker exec -u postgres -it pg psql
                        
Before executing the code: 
* npm install
*  npm run dev.  
