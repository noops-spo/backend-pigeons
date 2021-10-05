#!/bin/bash

docker build -t noopspool:test ./
docker run -d --name noopspool_test -p 8080:80 -v $(pwd)/data.json:/noopspoolData/data.json noopspool:test node /noopspool/app.js

sleep 10

curl -v "127.0.0.1:8080/v1/pigeons"
echo ""

curl -v "127.0.0.1:8080/v1/pigeons/2-11"
echo ""

curl -XPOST -v "127.0.0.1:8080/v1/pigeons/2-11" -H 'Content-Type: application/json' --data '{"sold":"reserved"}'
echo ""

curl -v "127.0.0.1:8080/v1/pigeons/2-11"
echo ""

sleep 120
docker logs noopspool_test

curl -v "127.0.0.1:8080/v1/pigeons/2-11"
echo ""


docker stop noopspool_test && docker rm noopspool_test