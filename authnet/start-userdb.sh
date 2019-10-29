docker run --name db-userauth \
  --env MYSQL_RANDOM_ROOT_PASSWORD=true \
  --env MYSQL_USER=unwhite \
  --env MYSQL_PASSWORD=unwhite910603Dsa \
  --env MYSQL_DATABASE=userauth \
  --volume `$(pwd)/my.cnf`:/etc/my.cnf \
  --volume `$(pwd)/../userauth-data`:/var/lib/mysql \
  --network authnet mysql/mysql-server:5.7