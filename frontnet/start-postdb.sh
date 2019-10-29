docker run --name db-posts \
  --env MYSQL_RANDOM_ROOT_PASSWORD=true \
  --env MYSQL_USER=unwhite \
  --env MYSQL_PASSWORD=unwhite910603Dsa \
  --env MYSQL_DATABASE=posts \
  --volume `$(pwd)/my.cnf`:/etc/my.cnf \
  --volume `$(pwd)/../posts-data`:/var/lib/mysql \
  --network frontnet mysql/mysql-server:5.7