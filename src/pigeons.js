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

const updateDataPigeon = (listPigeons) => {
    let pigeons = {};
    pigeons["pigeons"] = listPigeons;
    fs.writeFileSync('/noopspoolData/data.json', JSON.stringify(pigeons, null, 2) , 'utf-8');
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
            if (listPigeons[i]["sold"] != newStatus && listPigeons[i]["sold"] != 1) {
                listPigeons[i]["sold"] = newStatus;
                if (newStatus == "reserved") {
                    payment.checkPayment(listPigeons, id, cli);
                } else if (newStatus == 1) {
                    updateDataPigeon(listPigeons);
                }
                return listPigeons[i];
            } else {
                break;
            }
        }
    }
    console.log("Pigeon not found");
    return null;
}

const getBalanceValue = (utxos) => {
    const value = {};
    utxos.forEach((utxo) => {
      Object.keys(utxo.value).forEach((asset) => {
        if (!value[asset]) value[asset] = 0;
        value[asset] += utxo.value[asset];
      });
    });

    return value;
  };

const sendPigeon = (cli, addressPigeon, addressKeyPath, asset, customerAddress) => {

    console.debug("Debug: Function sendPigeon()");
    console.debug("Debug/addressPigeon: ", addressPigeon);
    console.debug("Debug/customerAddress: ", customerAddress);

    pigeonUtxo = cli.queryUtxo(addressPigeon);
    customerUtxo = cli.queryUtxo(customerAddress);
    // console.debug("Pigeon Balance: ", pigeonUtxo);
    // console.debug("Customer Balance: ", customerUtxo);

    let pigeonBalanceMap = new Map(Object.entries(getBalanceValue(pigeonUtxo)));
    let customerBalanceMap = new Map();

    pigeonBalanceMap.delete(asset);
    pigeonBalanceMap.set("lovelace", pigeonBalanceMap.get("lovelace") - 1500000);
    customerBalanceMap.set(asset, 1);
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
        metadata: { 1: { cli: "Sending " + asset.split('.')[1]} },
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
