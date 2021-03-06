#!/bin/bash



docker build -t noopspool:test ./
docker run -d --name noopspool_test -p 8080:80 -e CARDANO_NODE_SOCKET_PATH=/cardano/data/ipc -e BLOCKFROST_PROJECT_ID=$(cat secretBlockFrost) -e ADDRESS_KEY_PATH=/noopspool/keys/nft-payment.skey -e ADDRESS_MINT=addr[...] \
    -e RESERVATION_VALIDITY=1 -v /tmp/socket:/cardano/data/ipc -v /tmp/skey:/noopspool/keys/nft-payment.skey -v $(pwd)/data.json:/noopspoolData/data.json noopspool:test node /noopspool/app.js

sleep 10

curl -v "127.0.0.1:8080/v1/pigeons"
echo ""

curl -v "127.0.0.1:8080/v1/pigeons/PigeonsNFT15"
echo ""

curl -XPOST -v "127.0.0.1:8080/v1/pigeons/PigeonsNFT15" -H 'Content-Type: application/json' --data '{"sold":"reserved"}'
echo ""

# sleep 20

# curl -XPOST -v "127.0.0.1:8080/v1/pigeons/PigeonsNFT15" -H 'Content-Type: application/json' --data '{"sold":0}'
# echo ""

curl -v "127.0.0.1:8080/v1/pigeons/PigeonsNFT15"
echo ""

sleep 80
docker logs noopspool_test

curl -v "127.0.0.1:8080/v1/pigeons/PigeonsNFT15"
echo ""


docker stop noopspool_test && docker rm noopspool_test