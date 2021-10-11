## Sources

https://github.com/Berry-Pool/cardanocli-js/tree/main/examples

https://docs.armada-alliance.com/learn/cardano-developer-guides/cardano-nft-collection-tutorial-coming-soon

<br>

## Prerequisites

npm install cardanocli-js

Download mainnet-shelley-genesis.json config file from https://hydra.iohk.io/job/Cardano/cardano-node/cardano-deployment/latest/download/1/index.html

Install cardano-cli :

- Replace yourpath from cardano-cli and tunnel.sh (test)
- Copy cardano-cli to /usr/bin and chmod +x (test)

<br>

## Tunnel to connect to test relay

configure ~/.ssh/config with cardano-relay-1

<br>

## Launch script 

create wallet

test with "PigeonsPolicy"
```
node src/create-wallet.js
```

get balance

test with "PigeonsPolicy"
```
node src/queryTip.js
```

mint nft

check TODO
```
node src/mint.js
```

