In order to implement the queries:

docker run -e POSTGRES_PASSWORD=lol --name=sql -d -p 5432:5432 --rm btholt/complete-intro-to-sql
docker exec -u postgres -it sql psql omdb
