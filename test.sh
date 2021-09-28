#!/bin/bash

docker build -t noopspool:test ./
docker run -d --name noopspool_test -p 8080:80 -v $(pwd)/data.json:/noopspoolData/data.json noopspool:test node /noopspool/app.js

sleep 20

curl -v "127.0.0.1:8080/v1/pigeons"
echo ""

curl -v "127.0.0.1:8080/v1/pigeons/PigeonsNft11"
echo ""

curl -XPOST -v "127.0.0.1:8080/v1/pigeons/1" -H 'Content-Type: application/json' --data '{"status":"locked"}'
echo ""

sleep 10
docker logs noopspool_test

docker stop noopspool_test && docker rm noopspool_test