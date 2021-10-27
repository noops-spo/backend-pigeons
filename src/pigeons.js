const CardanocliJs = require("cardanocli-js");
const fs = require('fs');

const payment = require('./payment')

const initPigeon = () => {
    let pigeons = JSON.parse(fs.readFileSync('/noopspoolData/data.json'));
    return pigeons["pigeons"];
}

const initCardanoCLI = () => {
    const shelleyGenesisPath = "/noopspool/conf/mainnet-shelley-genesis.json";
    const cardanocliJs = new CardanocliJs({ shelleyGenesisPath });

    return cardanocliJs;
}

const getPigeonByID = (listPigeons, id) => {
    for (let i = 0; i < listPigeons.length; i++) {
        if (listPigeons[i]["id"] == id) {
            return listPigeons[i];
        }
    }
    console.log("Pigeon not found");
    return null;
}

const updatePigeonStatusByID = (listPigeons, id, newStatus, cli) => {
    for (let i = 0; i < listPigeons.length; i++) {
        if (listPigeons[i]["id"] == id) {
            listPigeons[i]["sold"] = newStatus;
            if (newStatus == "reserved") {
                // console.debug("Called checkPayment");
                payment.checkPayment(listPigeons, id, cli);
            }
            return listPigeons[i];
        }
    }
    console.log("Pigeon not found");
    return null;
}

const sendPigeon = (cli, addressPigeon, addressKeyPath, asset, customerAddress) => {
    pigeonUtxo = cli.queryUtxo(addressPigeon);
    customerUtxo = cli.queryUtxo(customerAddress);
    // console.log("Pigeon Balance: ", pigeonUtxo);
    // console.log("Customer Balance: ", customerUtxo);

    let pigeonBalanceMap = new Map(Object.entries(pigeonUtxo[0].value));
    let customerBalanceMap = new Map();
    let completeAsset;

    for(const key of pigeonBalanceMap.keys()) {
        if (key.includes(asset)) {
            completeAsset = key;
        }
    }

    pigeonBalanceMap.delete(completeAsset);
    pigeonBalanceMap.set("lovelace", pigeonBalanceMap.get("lovelace") - 1500000);
    customerBalanceMap.set(completeAsset, 1);
    customerBalanceMap.set("lovelace", 1500000);

    let txInfo = {
        txIn: pigeonUtxo,
        txOut: [
          {
            address: addressPigeon,
            value: Object.fromEntries(pigeonBalanceMap),
          },
          {
            address: customerAddress,
            value: Object.fromEntries(customerBalanceMap),
          },
        ],
        metadata: { 1: { cli: "Sending " + asset} },
      };

    let raw = cli.transactionBuildRaw(txInfo);
    let fee = cli.transactionCalculateMinFee({
        ...txInfo,
        txBody: raw,
        witnessCount: 1,
    });

    // console.log("Minimum Fee:", fee, "lovelace.");

    txInfo.txOut[0].value.lovelace -= fee;

    //create final transaction
    let tx = cli.transactionBuildRaw({ ...txInfo, fee });

    console.log("Transaction with fee:", tx);

    //sign the transaction
    let txSigned = cli.transactionSign({
        txBody: tx,
        signingKeys: [addressKeyPath],
    });

    // console.log("Transaction signed:", txSigned);

    //broadcast transaction
    let txHash = cli.transactionSubmit(txSigned);
    console.log("TxHash: " + txHash);
}

module.exports.initCardanoCLI = initCardanoCLI
module.exports.initPigeon = initPigeon
module.exports.getPigeonByID = getPigeonByID
module.exports.updatePigeonStatusByID = updatePigeonStatusByID
module.exports.sendPigeon = sendPigeon
